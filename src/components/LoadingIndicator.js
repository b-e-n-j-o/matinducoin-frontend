// LoadingIndicator.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoadingIndicator = ({ onComplete }) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/landing') {
      // Ne pas afficher le LoadingIndicator sur la page d'atterrissage
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, [onComplete, router.pathname]);

  if (router.pathname === '/landing') {
    return null;
  }

  return (
    <div className="loading-container fade-out">
      <div className="bottle-fade-out">
        <svg xmlns="http://www.w3.org/2000/svg" width="275" height="325" viewBox="0 0 200 800">
          <defs>
            <pattern id="water" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
              <path fill="#FEBE27" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
            </pattern>
            <pattern id="water2" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
              <path fill="#ff5900" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
            </pattern>
            <path id="bottle" d="M 270 138 q -0.5 4 -1 8 H 257 q 0.5 22 1 44 c 10.525 39.283 50.368 54.842 62 97 L 322 520 c 0 37.184 5.581 157.282 -7 174 c -6 7.975 -17.65 15.633 -29 18 H 107 c -15.57 -3.053 -27.538 -12.982 -33 -26 c -3.823 -9.111 -1.093 -19.85 -3 -32 V 456 l 2 -161 c 10.305 -49.593 45.54 -57.677 60 -92 c 6.463 -15.342 6.02 -36.015 6 -58 H 125 v -7 c 6.191 0.491 10.77 0.928 13 -3 h -6 V 61 l 3 -1 c 10.017 -6.186 120.05 -2.956 128 2 v 73 c -5.223 0.419 -3.984 -0.656 -6 3 h 13 Z"/>
            <mask id="bottle_mask">
              <use x="0" y="0" href="#bottle" opacity="1" fill="#fff"/>
            </mask>
          </defs>
          <use x="0" y="0" href="#bottle" fill="#CC000000"/>
          <rect className="water-fill" mask="url(#bottle_mask)" fill="url(#water)" x="0" y="0" width="2800" height="100"/>
          <rect className="water-fill2" mask="url(#bottle_mask)" fill="url(#water2)" x="0" y="0" width="2300" height="1000"/>
        </svg>
      </div>
    </div>
  );
};

export default LoadingIndicator;
