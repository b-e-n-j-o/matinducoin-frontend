import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import styles from './AnimationWrapper.module.css';

const AnimationWrapper = ({ children }) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${styles.animationWrapper} ${isVisible ? styles.visible : ''}`}
    >
      {children}
    </div>
  );
};

export default AnimationWrapper;
