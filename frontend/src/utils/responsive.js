// Responsive Design Utilities
// Use these utilities throughout your app for consistent responsive behavior

// Breakpoints (same as Tailwind defaults)
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

// Check if current device is mobile
export const isMobileDevice = () => {
  return window.innerWidth < BREAKPOINTS.mobile;
};

// Check if current device is tablet
export const isTabletDevice = () => {
  return window.innerWidth >= BREAKPOINTS.mobile && window.innerWidth < BREAKPOINTS.tablet;
};

// Check if current device is desktop
export const isDesktopDevice = () => {
  return window.innerWidth >= BREAKPOINTS.tablet;
};

// Get device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

// Check if device has touch capability
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get safe area insets (for notched devices)
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('--sat') || '0px',
    right: style.getPropertyValue('--sar') || '0px',
    bottom: style.getPropertyValue('--sab') || '0px',
    left: style.getPropertyValue('--sal') || '0px',
  };
};

// Debounce function for resize handlers
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll handlers
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Get viewport dimensions
export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Check if in landscape mode
export const isLandscape = () => {
  return window.innerWidth > window.innerHeight;
};

// Check if in portrait mode
export const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
};

// Get device pixel ratio
export const getPixelRatio = () => {
  return window.devicePixelRatio || 1;
};

// Check if device is high DPI
export const isHighDPI = () => {
  return getPixelRatio() >= 2;
};

// Check if PWA is installed
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

// Check if service worker is supported
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Check if push notifications are supported
export const isPushNotificationSupported = () => {
  return 'PushManager' in window;
};

export default {
  BREAKPOINTS,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  getDeviceType,
  isTouchDevice,
  getSafeAreaInsets,
  debounce,
  throttle,
  getViewportSize,
  isLandscape,
  isPortrait,
  getPixelRatio,
  isHighDPI,
  isPWAInstalled,
  isServiceWorkerSupported,
  isPushNotificationSupported,
};
