/**
 * Check if the browser is Edge
 * @param userAgent - The user agent
 */
export const isEdge = (userAgent) => {
  return userAgent.indexOf('Edge/') !== -1;
};

/**
 * Check if the browser is IE
 * @param userAgent - The user agent
 */
export const isIe = (userAgent) => {
  return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1;
};

/**
 * Check if the browser is Chrome
 * @param userAgent - The user agent
 */
export const isChrome = (userAgent) => {
  return userAgent.indexOf('Chrome') !== -1;
};

/**
 * Check if the browser is IE or Edge
 * @param userAgent - The user agent
 */
export const isIeOrEdge = (userAgent = window.navigator.userAgent) => {
  return isIe(userAgent) || isEdge(userAgent);
};
