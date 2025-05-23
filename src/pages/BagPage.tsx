import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Printer,
  ChevronUp,
  ChevronDown,
  CreditCard,
  Truck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductContext } from "@/contexts/ProductContext";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuantitySelector from "@/components/ui/quantity-selector";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const generateOrderNumber = () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

const BagPage = () => {
  const navigate = useNavigate();
  const {
    cart: bag,
    removeFromCart: removeFromBag,
    updateCartItemQuantity: updateBagItemQuantity,
    getCartTotal: getBagTotal,
    setCart, // Use setCart to directly update the cart state
  } = useProductContext();

  const [helpOpen, setHelpOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the order number from localStorage (if user navigates back)
    const savedOrderNumber = localStorage.getItem('currentOrderNumber');
    if (savedOrderNumber) setOrderNumber(savedOrderNumber);
  }, []);

  const handleQuantityChange = (
    productId: string | number,
    selectedColor: string,
    selectedSize: string,
    newQuantity: number
  ) => {
    // Start the calculation animation
    setIsCalculating(true);

    if (newQuantity === 0) {
      // Remove item if quantity becomes 0
      const item = bag.find(
        (item) =>
          item.product.id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (!item) {
        setIsCalculating(false);
        return;
      }

      // Simulate calculation time before removing the item
      setTimeout(() => {
        removeFromBag(productId, selectedColor, selectedSize);
        setIsCalculating(false);

        toast({
          title: "Item removed",
          description: `${item.product.name} has been removed from your bag`,
          duration: 7000, // 7 seconds
        });
      }, 600); // 600ms delay for the animation
    } else {
      // Update quantity directly to the selected value
      updateBagItemQuantity(
        productId,
        selectedColor,
        selectedSize,
        newQuantity
      );

      // Simulate calculation time
      setTimeout(() => {
        setIsCalculating(false);
      }, 600); // 600ms delay for the animation
    }
  };

  const handleRemoveItem = (
    productId: string | number,
    selectedColor: string,
    selectedSize: string
  ) => {
    // Start the calculation animation
    setIsCalculating(true);

    const item = bag.find(
      (item) =>
        item.product.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (!item) {
      setIsCalculating(false);
      return;
    }

    // Simulate calculation time before removing the item
    setTimeout(() => {
      removeFromBag(productId, selectedColor, selectedSize);
      setIsCalculating(false);

      toast({
        title: "Item removed",
        description: `${item.product.name} has been removed from your bag`,
        duration: 7000, // 7 seconds
      });
    }, 600); // 600ms delay for the animation
  };

  if (bag.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-20 min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
          <p className="mb-8 text-center max-w-md">
            Add some items to your bag before proceeding to checkout.
          </p>
          <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto relative">
          <Breadcrumbs items={[{ label: "BAG", path: "/bag" }]} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">YOUR SELECTIONS</h1>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 sm:px-4"
            >
              <Printer size={18} />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Bag items */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {bag.map((item, index) => {
                  const colorName =
                    item.product.colors.find(
                      (c) => c.value === item.selectedColor
                    )?.name || "Default";

                  return (
                    <div key={`${item.product.id}-${index}`}>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product image */}
                        <div className="w-full sm:w-32 h-48 sm:h-32 bg-omnis-darkgray flex-shrink-0">
                          <img
                            src={item.selectedImage || item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product details */}
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <div className="flex justify-between sm:block">
                                <h3 className="font-medium text-lg">
                                  {item.product.name}
                                </h3>
                                <div className="text-right sm:hidden">
                                  <span className="font-medium text-lg">
                                    $ {formatPrice(item.product.price)}
                                  </span>
                                </div>
                              </div>

                              <div className="text-sm text-omnis-lightgray mt-2 flex items-center gap-2">
                                <span>Variation:</span>
                                <Select
                                  value={item.selectedColor}
                                  onValueChange={(newColor) => {
                                    if (newColor !== item.selectedColor) {
                                      // Start the calculation animation
                                      setIsCalculating(true);

                                      // Create a new cart with the updated item
                                      const updatedCart = bag.map(
                                        (cartItem) => {
                                          if (
                                            cartItem.product.id ===
                                              item.product.id &&
                                            cartItem.selectedColor ===
                                              item.selectedColor &&
                                            cartItem.selectedSize ===
                                              item.selectedSize
                                          ) {
                                            // Find the variation image for the new color
                                            let newImage =
                                              cartItem.selectedImage;

                                            // Find the color name that corresponds to the new color value
                                            const newColorName =
                                              cartItem.product.colors.find(
                                                (c) => c.value === newColor
                                              )?.name;

                                            if (newColorName) {
                                              // Find the variation with that name
                                              const variation =
                                                cartItem.product.variations.find(
                                                  (v) => v.name === newColorName
                                                );

                                              // If the variation has an image, use it
                                              if (
                                                variation &&
                                                variation.image
                                              ) {
                                                newImage = variation.image;
                                              }
                                            }

                                            // Return the updated item with new color and image
                                            return {
                                              ...cartItem,
                                              selectedColor: newColor,
                                              selectedImage:
                                                newImage ||
                                                cartItem.product.image,
                                            };
                                          }
                                          return cartItem;
                                        }
                                      );

                                      // Update localStorage directly
                                      localStorage.setItem(
                                        "omnisCart",
                                        JSON.stringify(updatedCart)
                                      );

                                      // Update the cart state without triggering addToCartEvent
                                      setCart(updatedCart);

                                      // Simulate calculation time
                                      setTimeout(() => {
                                        setIsCalculating(false);
                                      }, 600); // 600ms delay for the animation
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[120px] sm:w-[140px] h-8 text-xs border-omnis-gray hover:border-white transition-colors focus:ring-0 focus:ring-offset-0 bg-transparent text-omnis-white">
                                    <SelectValue placeholder="Select color">
                                      {colorName}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.product.colors.map((color) => (
                                      <SelectItem
                                        key={color.value}
                                        value={color.value}
                                      >
                                        {color.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="text-sm text-omnis-lightgray mt-2 flex items-center gap-2">
                                <span>Size:</span>
                                <Select
                                  value={item.selectedSize || ""}
                                  onValueChange={(newSize) => {
                                    if (newSize !== item.selectedSize) {
                                      // Start the calculation animation
                                      setIsCalculating(true);

                                      // Create a new cart with the updated item
                                      const updatedCart = bag.map(
                                        (cartItem) => {
                                          if (
                                            cartItem.product.id ===
                                              item.product.id &&
                                            cartItem.selectedColor ===
                                              item.selectedColor &&
                                            cartItem.selectedSize ===
                                              item.selectedSize
                                          ) {
                                            // Return the updated item
                                            return {
                                              ...cartItem,
                                              selectedSize: newSize,
                                            };
                                          }
                                          return cartItem;
                                        }
                                      );

                                      // Update localStorage directly
                                      localStorage.setItem(
                                        "omnisCart",
                                        JSON.stringify(updatedCart)
                                      );

                                      // Update the cart state without triggering addToCartEvent
                                      setCart(updatedCart);

                                      // Simulate calculation time
                                      setTimeout(() => {
                                        setIsCalculating(false);
                                      }, 600); // 600ms delay for the animation
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[120px] sm:w-[140px] h-8 text-xs border-omnis-gray hover:border-white transition-colors focus:ring-0 focus:ring-offset-0 bg-transparent text-omnis-white">
                                    <SelectValue placeholder="Select size">
                                      {item.selectedSize
                                        ? item.selectedSize.toUpperCase()
                                        : ""}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.product.sizes.map((size) => (
                                      <SelectItem
                                        key={size.value}
                                        value={size.value}
                                      >
                                        {size.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="text-right hidden sm:block">
                              <span className="font-medium text-lg">
                                $ {formatPrice(item.product.price)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Quantity selector */}
                            <div className="flex items-center">
                              <QuantitySelector
                                quantity={item.quantity}
                                onChange={(newQuantity) =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.selectedColor,
                                    item.selectedSize,
                                    newQuantity
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center gap-4 sm:ml-4 mt-2 sm:mt-0">
                              <Button
                                variant="link"
                                className="text-omnis-lightgray hover:text-omnis-white p-0 h-auto text-sm"
                                onClick={() =>
                                  handleRemoveItem(
                                    item.product.id,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                              >
                                REMOVE
                              </Button>
                              <Separator
                                orientation="vertical"
                                className="h-4 hidden sm:block"
                              />
                              <Button
                                variant="link"
                                className="text-omnis-lightgray hover:text-omnis-white p-0 h-auto flex items-center gap-1 text-sm"
                                onClick={() =>
                                  navigate(`/product/${item.product.id}`)
                                }
                              >
                                VIEW DETAILS
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-omnis-lightgray">
                              AVAILABLE
                            </p>
                            <p className="text-sm text-omnis-lightgray">
                              Enjoy complimentary delivery or Collect In Store.
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < bag.length - 1 && (
                        <Separator className="mt-8 bg-omnis-gray/20" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="border border-omnis-gray/20 p-4 sm:p-6 sticky top-24">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Subtotal</span>
                    {isCalculating ? (
                      <div className="flex items-center">
                        <Icon
                          icon={Loader2}
                          className="mr-1 h-3 w-3 animate-spin"
                        />
                        <span className="text-omnis-lightgray">
                          Calculating...
                        </span>
                      </div>
                    ) : (
                      <span>$ {formatPrice(getBagTotal())}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="text-omnis-lightgray text-right">
                      Free
                      <span className="hidden sm:inline">
                        {" "}
                        (Premium Express)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>Estimated Tax</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-omnis-lightgray hover:text-omnis-white text-xs sm:text-sm"
                    >
                      Calculate
                    </Button>
                  </div>
                </div>

                <div className="border-t border-omnis-gray/30 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Estimated Total</span>
                    {isCalculating ? (
                      <div className="flex items-center">
                        <Icon
                          icon={Loader2}
                          className="mr-1 h-4 w-4 animate-spin"
                        />
                        <span className="text-omnis-lightgray">
                          Calculating...
                        </span>
                      </div>
                    ) : (
                      <span>$ {formatPrice(getBagTotal())}</span>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full font-bold text-sm sm:text-base"
                  size="lg"
                  onClick={() => {
                    // Generate and save order number on checkout
                    const newOrderNumber = generateOrderNumber();
                    setOrderNumber(newOrderNumber);
                    localStorage.setItem('currentOrderNumber', newOrderNumber);
                    setIsCheckingOut(true);
                    setTimeout(() => {
                      navigate("/checkout");
                    }, 800);
                  }}
                  disabled={bag.length === 0 || isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Icon
                        icon={Loader2}
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      <span className="inline-block">Processing...</span>
                    </>
                  ) : (
                    "CHECKOUT"
                  )}
                </Button>

                {/* Add extra spacing */}
                <div className="h-8"></div>

                <Collapsible
                  open={helpOpen}
                  onOpenChange={setHelpOpen}
                  className="mt-6 sm:mt-8"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer p-2 -mx-2 group">
                      <h3 className="font-medium text-sm sm:text-base relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-omnis-white after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                        MAY WE HELP?
                      </h3>
                      <div>
                        {helpOpen ? (
                          <Icon
                            icon={ChevronUp}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        ) : (
                          <Icon
                            icon={ChevronDown}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 text-xs sm:text-sm">
                    <p className="flex items-center gap-2">
                      <span>📞</span>
                      <a href="tel:+96181386697" className="hover:underline">
                        +961 81 386 697
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📧</span>
                      <a
                        href="mailto:contact@omnisclothing.net"
                        className="hover:underline"
                      >
                        contact@omnisclothing.net
                      </a>
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible
                  open={paymentOpen}
                  onOpenChange={setPaymentOpen}
                  className="mt-4 sm:mt-6"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer p-2 -mx-2 group">
                      <h3 className="font-medium text-sm sm:text-base relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-omnis-white after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                        PAYMENT OPTIONS
                      </h3>
                      <div>
                        {paymentOpen ? (
                          <Icon
                            icon={ChevronUp}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        ) : (
                          <Icon
                            icon={ChevronDown}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="sm:w-4 sm:h-4" />
                      <span>Credit/Debit Cards</span>
                    </div>
                    <div>
                      <p>We accept Visa, Mastercard, and American Express.</p>
                      <p className="mt-1 sm:mt-2">
                        All transactions are secure and encrypted.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible
                  open={shippingOpen}
                  onOpenChange={setShippingOpen}
                  className="mt-4 sm:mt-6"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer p-2 -mx-2 group">
                      <h3 className="font-medium text-sm sm:text-base relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-omnis-white after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                        SHIPPING OPTIONS
                      </h3>
                      <div>
                        {shippingOpen ? (
                          <Icon
                            icon={ChevronUp}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        ) : (
                          <Icon
                            icon={ChevronDown}
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="sm:w-4 sm:h-4" />
                      <span>Premium Express</span>
                    </div>
                    <div>
                      <p>Free shipping on all orders.</p>
                      <p className="mt-1 sm:mt-2">
                        Estimated delivery: 2-4 business days.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BagPage;
