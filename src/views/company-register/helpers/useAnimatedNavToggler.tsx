import { useState } from 'react';
import { useAnimation, useCycle } from 'framer-motion';

// Below logic is for toggling the navbar when toggleNavbar is called. It is used on mobile toggling of navbar.
export default (): any => {
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [x, cycleX] = useCycle('0%', '150%');
  const animation = useAnimation();

  const toggleNavbar = (): any => {
    setShowNavLinks(!showNavLinks);
    animation.start({ x, display: 'block' });
    cycleX();
  };

  return { showNavLinks, animation, toggleNavbar };
};
