import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import styles from '../styles/articles.module.css';
import Navbar from '../components/Navbar';

function Articles() {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        const articles = await response.json();
        console.log('Articles récupérés:', articles); // Debug log

        // Mélanger les articles aléatoirement
        const shuffledArticles = articles.sort(() => 0.5 - Math.random());

        // Grouper les articles en lignes de 4, 3, 4, etc.
        const rows = [];
        for (let i = 0; i < shuffledArticles.length; i += 11) {
          rows.push(
            shuffledArticles.slice(i, i + 4),
            shuffledArticles.slice(i + 4, i + 7),
            shuffledArticles.slice(i + 7, i + 11)
          );
        }

        setItems(rows);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (galleryRef.current && !isMobile) {
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;

        const factor = 1;
        const deltaX = (centerX - clientX) / factor;
        const deltaY = (centerY - clientY) / factor;

        galleryRef.current.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
      }
    };

    const container = containerRef.current;
    if (container && !isMobile) {
      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      const items = document.querySelectorAll(`.${styles.mobileItem}`);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(styles.visible);
            } else {
              entry.target.classList.remove(styles.visible);
            }
          });
        },
        {
          threshold: 0.1, // L'élément doit être à 10% visible pour déclencher l'animation
        }
      );

      items.forEach((item) => observer.observe(item));

      return () => {
        items.forEach((item) => observer.unobserve(item));
      };
    }
  }, [isMobile]);

  return (
    <>
      <Navbar />
      <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`} ref={containerRef}>
        {isMobile && <h1 className={styles.mobileTitle}>Articles</h1>}
        {loading ? (
          <div className={styles.loader}>Chargement...</div>
        ) : (
          <div className={styles.centerWrapper}>
            <div className={`${styles.gallery} ${isMobile ? styles.mobileGallery : ''}`} ref={galleryRef}>
              {isMobile ? (
                <div className={styles.mobileList}>
                  {items.flat().map((article) => (
                    <Link key={article._id} href={`/articles/${article._id}`}>
                      <div
                        className={`${styles.mobileItem} ${styles.hidden}`}
                        style={{ backgroundImage: `url(${article.previewImg || article.image_banner})` }}
                      >
                        <p className={styles.mobileItemText}>{article.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                items.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className={styles.row}>
                    {row.map((article) => (
                      <Link key={article._id} href={`/articles/${article._id}`}>
                        <div className={styles.item}>
                          <div className={styles.previewImg}>
                            <img
                              src={article.previewImg || article.image_banner}
                              alt={article.title}
                              loading="lazy"
                            />
                          </div>
                          <p className={styles.videoName}>{article.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Articles;
