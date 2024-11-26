import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = ({ onComplete }) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/landing') {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 20000);

    return () => clearTimeout(timer);
  }, [onComplete, router.pathname]);

  if (router.pathname === '/landing') {
    return null;
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.bottleContainer}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 200 800"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="water" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
              <path fill="#FEBE27" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
            </pattern>
            <pattern id="water2" width=".25" height="1.1" patternContentUnits="objectBoundingBox">
              <path fill="#ff5900" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"/>
            </pattern>
            <path id="bottle" d="M270 138q-0.5 4-1 8H257q0.5 22 1 44c10.525 39.283 50.368 54.842 62 97L322 520c0 37.184 5.581 157.282-7 174c-6 7.975-17.65 15.633-29 18H107c-15.57-3.053-27.538-12.982-33-26c-3.823-9.111-1.093-19.85-3-32V456l2-161c10.305-49.593 45.54-57.677 60-92c6.463-15.342 6.02-36.015 6-58H125v-7c6.191 0.491 10.77 0.928 13-3h-6V61l3-1c10.017-6.186 120.05-2.956 128 2v73c-5.223 0.419-3.984-0.656-6 3h13Z"/>
            <mask id="bottle_mask">
              <use x="0" y="0" href="#bottle" opacity="1" fill="#fff"/>
            </mask>
          </defs>
          <use x="0" y="0" href="#bottle" fill="#CC000000"/>
          <rect 
            className={styles.waterFill} 
            mask="url(#bottle_mask)" 
            fill="url(#water)" 
            x="0" 
            y="0" 
            width="2800" 
            height="100"
          />
          <rect 
            className={styles.waterFill2} 
            mask="url(#bottle_mask)" 
            fill="url(#water2)" 
            x="0" 
            y="0" 
            width="2300" 
            height="1000"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoadingIndicator;