import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top on route change
 * This component doesn't render anything, it just uses the useLocation hook
 * to detect route changes and scrolls to the top when they occur
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scrolling without animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
