import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ id }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if id is valid and element exists
    if (id) {
      let element = document.getElementById(id);

      if (element) {
        // Scroll to the top of the element
        element.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      }
    } else {
      // If no id is provided, scroll to the top of the window
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
