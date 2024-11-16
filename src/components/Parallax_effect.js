import React, { useEffect, useState } from 'react';
import styles from '../../styles/Parallax.module.css';

const Parallax = ({ backgroundImage, title }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.parallaxContainer}>
      <div 
        className={styles.backgroundImage}
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${scrollPosition * 0.5}px)`
        }}
      />
      <div 
        className={styles.content}
        style={{ transform: `translateY(${-scrollPosition * 0.2}px)` }}
      >
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  );
};

export default Parallax;