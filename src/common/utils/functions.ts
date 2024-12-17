import * as React from 'react';
import { DragEvent, ChangeEvent } from 'react';

// use window.safeKey = for easy tinkering in the console.
export const safeKey = (() => {
  // Safely allocate plainObject's inside iife
  // Since this function may get called very frequently -
  // I think it's important to have plainObject's
  // statically defined
  const obj = {};
  const arr = [];

  // ...if for some reason you ever use square brackets on these types...
  // const fun = function() {}
  // const bol = true;
  // const num = 0;
  // const str = '';
  return (key) => {
    // eslint-disable-next-line security/detect-object-injection
    if (obj[key] !== undefined || arr[key] !== undefined) {
      return `SAFE_${key}`;
    } else {
      return key;
    }
  };
})();

/**
 * Generate random string
 * @param count - The length of generated string
 */
export const generateRandom = (count: number): string => {
  const sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for (let i = 0; i < count; i++) {
    const idx = Math.random() * sym.length;

    str += sym.charAt(idx);
  }

  return str;
};

/**
 * Compose utility function for HOC
 * @param fns - HOC function
 * @param component - Component
 */
export const compose = (fns: Function[], component: React.ComponentType) => {
  let ret = component;

  fns.forEach((f) => {
    ret = f(ret);
  });

  return ret;
};

/**
 * Pick object with none empty value
 * @param obj - The object you want to filter
 * @param isStrict - Exclude string of empty
 */
export const pickNotEmpty = (obj: Record<string, any> | string | number | boolean, isStrict: boolean = false) => {
  const newObj = {};

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    if (obj[safeKey(key)] && Array.isArray(obj[safeKey(key)])) {
      // isArray
      const arr = obj[safeKey(key)];

      newObj[safeKey(key)] = [];
      arr.forEach((d) => {
        newObj[safeKey(key)].push(pickNotEmpty(d, isStrict));
      });
    } else if (obj[safeKey(key)] && typeof obj[safeKey(key)] === 'object') {
      // isObject
      newObj[safeKey(key)] = pickNotEmpty(obj[safeKey(key)], isStrict);
    } else if (isStrict && obj[safeKey(key)] === '') {
      // pass
    } else if (obj[safeKey(key)] !== undefined && obj[safeKey(key)] !== null) {
      newObj[safeKey(key)] = obj[safeKey(key)];
    }
  });

  return newObj;
};

const isDragEvt = (value: any): value is DragEvent => {
  return !!value.dataTransfer;
};

const isInput = (value: EventTarget | null): value is HTMLInputElement => {
  return value !== null;
};

/**
 * Extact file array from the event
 * @param e - The event
 */
export const getFilesFromEvent = (e: DragEvent | ChangeEvent): File[] => {
  if (isDragEvt(e)) {
    return Array.from(e.dataTransfer.files);
  } else if (isInput(e.target)) {
    return Array.from(e.target.files);
  }

  return [];
};

export const debounce = (func, delay) => {
  let inDebounce;

  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const getHrefTel = (phoneNumber: string = '', countryCode: string = '66') => {
  return `tel:${countryCode}-${phoneNumber.replace(/ /g, '-')}`;
};

export const getFacebookShareUrl = (appId: string, url: string, display: string = 'popup', redirectUrl?: string) => {
  let shareUrl = `https://www.facebook.com/dialog/share?app_id=${appId}&href=${encodeURIComponent(url)}&display=${display}`;

  if (redirectUrl) {
    shareUrl += `&redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  return shareUrl;
};

export const getLineShareUrl = (url: string) => {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
};

const fullMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getFullMonthName = (date: Date) => {
  return date && fullMonthNames[date.getMonth()];
};

const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getShortMonthName = (date: Date) => {
  return date && shortMonthNames[date.getMonth()];
};

export const createJavascriptTag = async (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.onload = () => {
      resolve();
    };
    script.onerror = (err) => {
      reject(err);
    };
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};

export const moveCursor = (node: Node, toStart: boolean = true) => {
  if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
    const range = document.createRange();

    range.selectNodeContents(node);
    range.collapse(toStart);
    const sel = window.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof (document.body as any).createTextRange != 'undefined') {
    const textRange = (document.body as any).createTextRange();

    textRange.moveToElementText(node);
    textRange.collapse(toStart);
    textRange.select();
  }
};

export const getMaxPage = (numOfItems: number, perPage: number) => {
  const maxPage = Math.floor(numOfItems / perPage);

  return numOfItems % perPage > 0 ? maxPage + 1 : maxPage;
};

export const zeroPadding = (num: string | number, length: number) => {
  const zeros = new Array(length + 1).join('0');

  console.assert(length < zeros.length, `length should be less than ${zeros.length}`);

  return (zeros + String(num)).slice(-length);
};

// eslint-disable-next-line complexity
export const objectShallowEquals = (x: any, y: any) => {
  if (x === y) {
    return true;
  } else if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      return false;
    }

    return x.every((xi, i) => y[safeKey(i)] === xi);
  } else if (typeof x == 'object' && typeof y == 'object') {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (const key in x) {
      if (!y.hasOwnProperty(key) || x[safeKey(key)] !== y[safeKey(key)]) {
        return false;
      }
    }

    return true;
  }
};

// eslint-disable-next-line complexity
export const objectDeepEquals = (x: any, y: any) => {
  if (x === y) {
    return true;
  } else if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      return false;
    }

    return x.every((xi, i) => objectDeepEquals(xi, y[safeKey(i)]));
  } else if (typeof x == 'object' && typeof y == 'object') {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }

    for (const key in x) {
      if (!y.hasOwnProperty(key) || !objectDeepEquals(x[safeKey(key)], y[safeKey(key)])) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export const isInteger = (x: string | number) => {
  if (typeof x === 'number') {
    return Number.isInteger(x);
  } else if (typeof x === 'string') {
    return x.length > 0 && !isNaN(+x) && Number.parseInt(x, 10) === +x;
  }

  return false;
};

export const pickFirstValueFromQuery = (x: string | string[]) => {
  return Array.isArray(x) ? x[0] : x;
};
