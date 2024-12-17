import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { debounce, objectDeepEquals, safeKey } from './functions';

export const mergeRefs = (refs: any[]) => {
  return (value) => {
    refs.forEach((ref) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(value);
        } else {
          ref.current = value;
        }
      }
    });
  };
};

export const useDelayState = <T>(initialState: T, delay: number = 0) => {
  const [viewState, setViewState] = React.useState(initialState);
  const [delayState, setDelayState] = React.useState(initialState);

  const updateDelayState = React.useMemo(
    () =>
      debounce((value: T) => {
        setDelayState(value);
      }, delay),
    [delay, setDelayState],
  );

  const onViewStateChange = React.useCallback(
    (value: T) => {
      setViewState(value);
      updateDelayState(value);
    },
    [setViewState, updateDelayState],
  );

  return [viewState, delayState, onViewStateChange] as const;
};

type ScrollPosition = {
  scrollX: number;
  scrollY: number;
};

const getScrollPosition = (): ScrollPosition => {
  return process.browser ? { scrollX: window.pageXOffset, scrollY: window.pageYOffset } : { scrollX: 0, scrollY: 0 };
};

export const useScrollPosition = (callback: (pos: ScrollPosition) => void, deps: any[]) => {
  React.useEffect(() => {
    let requestRunning: number | null = null;

    const handleScroll = () => {
      if (process.browser && requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          callback(getScrollPosition());
          requestRunning = null;
        });
      }
    };

    if (process.browser) {
      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback].concat(deps));
};

export function useValueChangeDetector<T>(value: T, onChange: (value: T) => void) {
  const [lastValue, setLastValue] = React.useState<T>(value);

  React.useEffect(() => {
    if (!objectDeepEquals(lastValue, value)) {
      setLastValue(value);
      onChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}

export const useScrollToError = <T>() => {
  const scrollToError = React.useCallback((errors: FieldErrors<T>) => {
    const keys = Object.keys(errors);

    for (const key of keys) {
      if (errors[safeKey(key)] && errors[safeKey(key)].ref) {
        errors[safeKey(key)].ref.scrollIntoView();
        break;
      }
    }
  }, []);

  return { scrollToError };
};
