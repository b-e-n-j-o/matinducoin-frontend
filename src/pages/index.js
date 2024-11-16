// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Landing.module.css';
import { useTransition } from '../context/TransitionContext';
import { useEffect, useState } from 'react';

import { gsap } from 'gsap';
const anime = require('animejs/lib/anime.js');

const Landing = () => {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const { setIsTransitioning } = useTransition();
  const [counterValue, setCounterValue] = useState(0);


  useEffect(() => {
    const startLoader = () => {
      const updateCounter = () => {
        setCounterValue((prevValue) => {
          if (prevValue < 100) {
            let increment = Math.floor(Math.random()/100000) + 1;
            let newValue = Math.min(prevValue + increment, 100);
            
            if (newValue < 100) {
              let delay = Math.floor(Math.random() * 200) + 25;
              setTimeout(updateCounter, delay);
            }
            
            return newValue;
          }
          return prevValue;
        });
      };
    
      updateCounter();
    };

    startLoader();
    gsap.to(`.${styles.count}`, { opacity: 0, delay: 1.5, duration: 0.5 });

    let textWrapper = document.querySelector(`.${styles.ml16}`);
    if (textWrapper) {
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({ loop: false })
        .add({
          targets: `.${styles.ml16} .letter`,
          translateY: [-100, 0],
          easing: "easeOutExpo",
          duration: 1500,
          delay: (el, i) => 30 * i
        })
        .add({
          targets: `.${styles.ml16} .letter`,
          translateY: [0, 100],
          easing: "easeOutExpo",
          duration: 2000,
          delay: (el, i) => 1500 + 30 * i
        });
    }

    gsap.to(`.${styles.count}`, {
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      delay: 2.75,
    });

    gsap.to(`.${styles.copy}`, {
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      delay: 2.75,
    });

    gsap.to(`.${styles.preLoader}`, {
      scale: 0.5,
      ease: "power4.inOut",
      duration: 2,
      delay: 2,
    });

    gsap.to(`.${styles.loader}`, {
      height: "0",
      ease: "power4.inOut",
      duration: 1.5,
      delay: 2.75,
    });

    gsap.to(`.${styles.loaderBg}`, {
      height: "0",
      ease: "power4.inOut",
      duration: 1.5,
      delay: 3,
    });

    gsap.to(`.${styles.loader2}`, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      ease: "power4.inOut",
      duration: 1.5,
      delay: 2.5,
    });

    gsap.from(`.${styles.headerTitle}`, {
      y: 200,
      ease: "power4.inOut",
      duration: 1.5,
      delay: 2.75,
      stagger: 0.05
    });

    gsap.to(`.${styles.img}`, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: "power4.inOut",
      duration: 1.5,
      delay: 3.5,
      stagger: 0.25
    });

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsTransitioning(true);
        router.replace('/home');
      }, 1000);
    }, 3200);

  }, [router, setIsTransitioning]);

  return (
    <>
      <div className={`${styles.landing} ${fadeOut ? styles.fadeOut : ''}`}>
        <div className={styles.preLoader}>
          <div className={styles.loader}></div>
          <div className={styles.loaderBg}></div>
        </div>
        <div className={styles.loaderContent}>
          <div className={styles.count}>{counterValue}</div>
          <div className={styles.copy}>
            <p className={`${styles.ml16} customTextColor`}>BON MATIN!</p>
          </div>
        </div>
        <div className={styles.loader2}></div>
      </div>
      <div style={{ display: fadeOut ? 'block' : 'none' }}>
        <nav style={{ /* Styles pour la navbar */ }}>
        </nav>
      </div>
    </>
  );
};

export default Landing;