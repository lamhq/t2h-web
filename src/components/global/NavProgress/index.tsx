import React from 'react';
import nProgress from 'nprogress';
import Router from 'next/router';
import { theme } from '../theme';

interface NavProgressProps {
  color?: string;
  isSpinnerEnabled?: boolean;
}

export const NavProgress: React.FC<NavProgressProps> = ({ color, isSpinnerEnabled }: NavProgressProps) => {
  const startProgress = () => nProgress.start();
  const stopProgress = (timer) => {
    clearTimeout(timer);
    nProgress.done();
  };
  const showProgressBar = (delay) => {
    const timer = setTimeout(startProgress, delay);

    Router.events.on('routeChangeComplete', () => stopProgress(timer));
    Router.events.on('routeChangeError', () => stopProgress(timer));
  };

  Router.events.on('routeChangeStart', () => showProgressBar(10));

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: ${color};
        position: fixed;
        z-index: 1201;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 5px ${color}, 0 0 2px ${color};
        opacity: 1;
        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }
      #nprogress .spinner {
        display: ${isSpinnerEnabled ? 'block' : 'none'};
        position: fixed;
        z-index: 1201;
        top: 15px;
        right: 15px;
      }
      #nprogress .spinner-icon {
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        border: solid 2px transparent;
        border-top-color: ${color};
        border-left-color: ${color};
        border-radius: 50%;
        -webkit-animation: nprogresss-spinner 400ms linear infinite;
        animation: nprogress-spinner 400ms linear infinite;
      }
      .nprogress-custom-parent {
        overflow: hidden;
        position: relative;
      }
      .nprogress-custom-parent #nprogress .spinner,
      .nprogress-custom-parent #nprogress .bar {
        position: absolute;
      }
      @-webkit-keyframes nprogress-spinner {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }
      @keyframes nprogress-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
};

NavProgress.defaultProps = {
  color: theme.colors.primary,
  isSpinnerEnabled: false,
};

export default NavProgress;
