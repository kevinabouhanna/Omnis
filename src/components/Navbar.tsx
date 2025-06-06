import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductContext } from "@/contexts/ProductContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/framer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BagDropdown from "./BagDropdown";
import { Icon } from "@/components/ui/icon";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface NavbarProps {
  scrollY?: number;
  showLogoEffect?: boolean;
}

const Navbar = ({ scrollY = 0, showLogoEffect = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Explicitly set scrolled to false initially to ensure transparent background on load
  const [scrolled, setScrolled] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [bagDropdownOpen, setBagDropdownOpen] = useState(false);
  // Separate state for mobile bag dropdown
  const [mobileBagDropdownOpen, setMobileBagDropdownOpen] = useState(false);
  // Track if the dropdown should be opened by an add-to-bag action
  const [shouldOpenFromAddToBag, setShouldOpenFromAddToBag] = useState(false);
  const {
    cart: bag,
    addToCartEvent,
    resetAddToCartEvent,
  } = useProductContext();
  const prevBagCountRef = useRef(0);
  const location = useLocation();
  const { user } = useAuth();

  // Calculate total items in bag
  const bagItemCount = bag.reduce((total, item) => total + item.quantity, 0);

  // Close dropdowns when location changes
  useEffect(() => {
    // Always close the dropdowns when changing pages
    setBagDropdownOpen(false);
    setMobileBagDropdownOpen(false);
    // Reset the add-to-bag flag when changing pages
    setShouldOpenFromAddToBag(false);
  }, [location]);

  const toggleMenu = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Add or remove a class from the body to track mobile menu state
    if (newIsOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  };

  // Listen for the addToCart event
  useEffect(() => {
    if (addToCartEvent) {
      // When an item is added to the cart, set the flag to open the dropdown
      setShouldOpenFromAddToBag(true);
      // Reset the event in the context
      resetAddToCartEvent();
    }
  }, [addToCartEvent, resetAddToCartEvent]);

  // Animate badge when bag count changes and conditionally open dropdown
  useEffect(() => {
    // Store the current value for comparison
    const prevCount = prevBagCountRef.current;

    // Check if items were actually added (not on page navigation/remount)
    if (bagItemCount > prevCount) {
      // Animate the badge
      setAnimateBadge(true);

      // Only open the dropdown if the add-to-bag action triggered it
      if (shouldOpenFromAddToBag) {
        // Check if we're on mobile or desktop
        if (window.innerWidth < 768) {
          // On mobile, open the mobile dropdown
          setMobileBagDropdownOpen(true);
        } else {
          // On desktop, open the desktop dropdown
          setBagDropdownOpen(true);
        }
        // Reset the flag after opening
        setShouldOpenFromAddToBag(false);
      }

      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }

    // Always update the ref to the current count after the check
    prevBagCountRef.current = bagItemCount;
  }, [bagItemCount, shouldOpenFromAddToBag]);

  // Track window width for responsive adjustments
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Handle scroll for navbar background and update window width
  useEffect(() => {
    const handleScroll = () => {
      // Ensure scroll position is never negative (prevents issues during pull-to-refresh)
      const scrollPosition = Math.max(0, window.scrollY);
      if (scrollPosition > 50) {
        // Increased threshold from 10px to 50px
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Force transparent background on initial load (no initial check)
    setScrolled(false);

    // Initial window width
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track if we're fully scrolled for logo height calculations
  const [isFullyScrolled, setIsFullyScrolled] = useState(false);

  // Set maxScroll to a very small value to trigger the animation with a single scroll event
  const maxScroll = 1; // Extremely short scroll distance to trigger with a single wheel event

  // Update isFullyScrolled state when scroll position changes
  // If logo effect is disabled, always consider it fully scrolled
  useEffect(() => {
    // Ensure we're using a non-negative scroll value (prevents issues during pull-to-refresh)
    const safeScrollY = Math.max(0, scrollY);
    setIsFullyScrolled(showLogoEffect ? safeScrollY >= maxScroll : true);
  }, [scrollY, maxScroll, showLogoEffect]);

  // Calculate logo transform values based on scroll position
  // Ensure scrollY is never negative (prevents scaling during pull-to-refresh)
  const safeScrollY = Math.max(0, scrollY);
  const progress = Math.min(1, safeScrollY / maxScroll);

  // Only calculate transition values if the logo effect is enabled
  // Otherwise, use fixed values for the navbar logo

  // Calculate responsive scale based on screen width
  // On mobile, use a smaller initial scale (2x instead of 8x)
  const initialScale = windowWidth < 768 ? 2.8 : 8;
  const finalScale = 1;

  // Calculate scale - from initialScale (large) to finalScale (navbar size)
  // If logo effect is disabled, always use the final scale
  // Use easeOutExpo easing for smoother transition with a quick start and gentle finish
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  // For mobile, once the logo is collapsed, prevent it from scaling back up
  // For desktop, allow normal scaling behavior
  // Also add a check for scrolled state to keep logo locked during pull-to-refresh
  const logoScale = showLogoEffect
    ? windowWidth < 768 && (isFullyScrolled || scrolled)
      ? finalScale // Keep at final scale once fully scrolled or when navbar is in scrolled state
      : initialScale - easeOutExpo(progress) * (initialScale - finalScale)
    : finalScale;

  // Simplified letter spacing calculation
  // At initialScale (large logo): -3.4px
  // At finalScale (small logo): -3.4px
  const initialSpacing = -3.4;
  const finalSpacing = -3.4;

  // If logo is at initialScale or near it, use initialSpacing
  // If logo is at finalScale, use finalSpacing
  // Otherwise interpolate between the values based on current scale
  const letterSpacing = showLogoEffect
    ? logoScale === finalScale
      ? `${finalSpacing}px`
      : logoScale === initialScale || logoScale > initialScale * 0.9
        ? `${initialSpacing}px`
        : `${
            finalSpacing +
            ((logoScale - finalScale) / (initialScale - finalScale)) *
              (initialSpacing - finalSpacing)
          }px`
    : `${finalSpacing}px`;

  // Calculate Y position - responsive based on screen width
  // Use a smaller initial Y offset on mobile to keep it in view
  const initialY = windowWidth < 768 ? 120 : 180;

  // When fully scrolled (progress = 1), we want the logo to be vertically centered
  // If logo effect is disabled, always use 0 for Y position
  // Use the same easeOutExpo easing for smoother transition
  // For mobile, ensure the logo is vertically centered when collapsed
  const logoY = showLogoEffect
    ? windowWidth < 768 && (isFullyScrolled || scrolled)
      ? 0 // Keep at 0 (vertically centered) once fully scrolled or when navbar is in scrolled state
      : initialY * (1 - easeOutExpo(progress))
    : 0;

  // We don't need logoX anymore as we're using CSS centering
  // const logoX = 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Optionally, you can add a redirect or notification here
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        !showLogoEffect || scrolled
          ? "bg-omnis-black/90 backdrop-blur-md py-3 md:py-2 shadow-md"
          : "bg-transparent py-5 md:py-4"
      )}
    >
      <div className="container mx-auto relative">
        {/* Absolute positioned logo in the center - only shown when effect is enabled */}
        {showLogoEffect && (
          <div className="absolute left-0 right-0 flex justify-center items-center z-50 w-full h-full pointer-events-none">
            <div
              className={
                isFullyScrolled ? "pointer-events-auto" : "pointer-events-none"
              }
            >
              <motion.div
                style={{
                  transform: `translateY(${logoY}px) scale(${logoScale})`,
                  transformOrigin: "center center",
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="relative"
              >
                <Link
                  to="/"
                  className={`text-2xl sm:text-3xl md:text-5xl font-logo font-medium ${
                    isFullyScrolled
                      ? "hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] cursor-pointer"
                      : "cursor-default"
                  }`}
                  style={{
                    letterSpacing: letterSpacing,
                    whiteSpace: "nowrap",
                    maxHeight: isFullyScrolled
                      ? windowWidth < 768
                        ? "40px"
                        : "64px"
                      : "none",
                    display: "block",
                    lineHeight: isFullyScrolled
                      ? windowWidth < 768
                        ? "40px"
                        : "64px"
                      : "normal",
                    fontSize: windowWidth < 768 ? "40px" : undefined,
                    pointerEvents: isFullyScrolled ? "auto" : "none", // Only clickable when small
                  }}
                >
                  OMNIS
                </Link>
              </motion.div>
            </div>
          </div>
        )}

        {/* Regular centered navbar logo - only shown when effect is disabled */}
        {!showLogoEffect && (
          <div className="absolute left-0 right-0 flex justify-center items-center z-50 w-full h-full pointer-events-none">
            <div className="pointer-events-auto">
              <Link
                to="/"
                className="text-2xl sm:text-3xl md:text-5xl font-logo font-medium hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                style={{
                  letterSpacing,
                  whiteSpace: "nowrap",
                  maxHeight: windowWidth < 768 ? "40px" : "64px",
                  display: "block",
                  lineHeight: windowWidth < 768 ? "40px" : "64px",
                  fontSize: windowWidth < 768 ? "40px" : undefined,
                }}
              >
                OMNIS
              </Link>
            </div>
          </div>
        )}

        {/* Flex container for navigation items */}
        <div className="flex justify-between items-center h-full py-2 md:py-2">
          {/* Left side navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink to="/about">ABOUT</NavLink>
          </nav>

          {/* Right side navigation */}
          <nav className="hidden md:flex items-center space-x-10 ml-auto">
            <NavLink to="/shop">SHOP</NavLink>
            <Popover open={bagDropdownOpen} onOpenChange={setBagDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  className="relative group p-3"
                  aria-label={`Shopping bag with ${bagItemCount} items`}
                >
                  <Icon
                    icon={ShoppingBag}
                    size={24}
                    className={`${
                      bagItemCount > 0
                        ? "text-omnis-white"
                        : "text-omnis-lightgray"
                    } group-hover:text-omnis-white transition-colors duration-200 p-0.5`}
                  />
                  {bagItemCount > 0 && (
                    <Badge
                      variant="default"
                      className={`absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-600 text-white text-xs font-medium ${
                        animateBadge ? "animate-pulse scale-125" : ""
                      }`}
                    >
                      {bagItemCount}
                    </Badge>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[90vw] sm:w-[350px] md:w-[450px] border-0 shadow-xl"
                align="end"
                sideOffset={16}
                side="bottom"
              >
                <BagDropdown onClose={() => setBagDropdownOpen(false)} />
              </PopoverContent>
            </Popover>
            {user && (
              <li>
                <a href="/track-order" className="hover:underline">Track Order</a>
              </li>
            )}
            {user ? (
              <li>
                <button onClick={handleLogout} className="hover:underline text-red-600">Logout</button>
              </li>
            ) : (
              <li className="list-none">
                <a href="/auth" aria-label="Login" className="flex items-center justify-center p-2 rounded hover:bg-zinc-800 transition-colors">
                  <User size={22} className="text-zinc-200" />
                </a>
              </li>
            )}
          </nav>

          {/* Mobile Bag Icon */}
          <Popover
            open={mobileBagDropdownOpen}
            onOpenChange={(open) => {
              setMobileBagDropdownOpen(open);
              // If the dropdown is being closed, add a delay before actually closing it
              if (!open) {
                // This prevents the dropdown from closing too quickly
                setTimeout(() => {
                  setMobileBagDropdownOpen(false);
                }, 100);
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
                className="md:hidden text-omnis-white z-50 p-2 hover:bg-omnis-darkgray/20 rounded-md transition-colors relative mr-12 flex items-center"
                aria-label={`Shopping bag with ${bagItemCount} items`}
                onClick={() => {
                  // Toggle the dropdown with a slight delay to ensure it stays open
                  if (!mobileBagDropdownOpen) {
                    setMobileBagDropdownOpen(true);
                  }
                }}
              >
                <Icon
                  icon={ShoppingBag}
                  size={22}
                  className={`${
                    bagItemCount > 0
                      ? "text-omnis-white"
                      : "text-omnis-lightgray"
                  } transition-colors duration-200 p-0.5`}
                />
                {bagItemCount > 0 && (
                  <Badge
                    variant="default"
                    className={`absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-600 text-white text-xs font-medium ${
                      animateBadge ? "animate-pulse scale-125" : ""
                    }`}
                  >
                    {bagItemCount}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 border-0 shadow-xl"
              align="center"
              sideOffset={16}
              side="bottom"
            >
              <BagDropdown onClose={() => setMobileBagDropdownOpen(false)} />
            </PopoverContent>
          </Popover>

          {/* Mobile Menu Button - Always visible on top of overlay */}
          <HamburgerMenu
            isOpen={isOpen}
            onClick={toggleMenu}
            className="md:hidden z-[101] ml-auto p-2 hover:bg-omnis-darkgray/20 rounded-md transition-colors flex items-center"
          />

          {/* Mobile Navigation Overlay */}
          <div
            className={cn(
              "fixed inset-0 z-[99] bg-omnis-black flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
              isOpen
                ? "opacity-100 visible pointer-events-auto"
                : "opacity-0 invisible pointer-events-none"
            )}
            style={{
              height: "100dvh", // Use dynamic viewport height for better mobile experience
              width: "100vw",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <nav className="flex flex-col items-center space-y-10 text-3xl z-[100] pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="pointer-events-auto z-[100]"
              >
                <MobileNavLink to="/about" onClick={toggleMenu}>
                  ABOUT
                </MobileNavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="pointer-events-auto z-[100]"
              >
                <MobileNavLink to="/shop" onClick={toggleMenu}>
                  SHOP
                </MobileNavLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="pointer-events-auto z-[100]"
              >
                <MobileNavLink to="/bag" onClick={toggleMenu}>
                  BAG{" "}
                  {bagItemCount > 0 && (
                    <span className="inline-flex items-center justify-center ml-2 bg-red-600 text-white rounded-full h-6 w-6 text-xs tracking-normal">
                      {bagItemCount}
                    </span>
                  )}
                </MobileNavLink>
              </motion.div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className="text-omnis-white text-sm tracking-wider font-medium hover:text-gray-300 transition-colors relative after:absolute after:bottom-[10px] after:left-0 after:w-full after:h-[1px] after:bg-omnis-white after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 hover:after:origin-bottom-left py-3"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  // Handle click with a small delay to ensure the menu closes before navigation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default to handle navigation manually

    // First close the menu
    onClick();

    // Use a delay to ensure the menu transition completes before navigation
    // This prevents the white flash by ensuring the menu fade-out is complete
    setTimeout(() => {
      // Use React Router's navigation instead of direct window.location changes
      // This prevents full page reloads and maintains the SPA experience
      navigate(to);
    }, 300); // Use a consistent 300ms delay for all pages to match the menu transition
  };

  return (
    <a
      href={to}
      className="text-omnis-white flex items-center tracking-widest font-medium relative z-[100] py-4 px-6 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-omnis-white hover:after:w-full after:transition-all after:duration-300"
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

// Custom hamburger menu component with 2 lines that animates to an X
interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const HamburgerMenu = ({ isOpen, onClick, className }: HamburgerMenuProps) => {
  return (
    <button
      className={cn(
        "relative w-6 h-6 flex flex-col justify-center items-center",
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <span
        className={cn(
          "block w-6 h-0.5 bg-omnis-white transition-all duration-300 ease-in-out origin-center",
          isOpen
            ? "absolute rotate-45 scale-110" // First line rotates to form one half of the X
            : "mb-1.5 translate-y-[-2px]" // Normal position for first line, slightly higher
        )}
      />
      <span
        className={cn(
          "block w-6 h-0.5 bg-omnis-white transition-all duration-300 ease-in-out origin-center",
          isOpen
            ? "absolute -rotate-45 scale-110" // Second line rotates to form other half of the X
            : "translate-y-[2px]" // Normal position for second line, slightly lower
        )}
      />
    </button>
  );
};

export default Navbar;
