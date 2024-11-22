import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import ProductCard from './ProductCard';
import styles from './BlogArticle.module.css';
import { fetchArticle } from '../services/api';

const BlogArticle = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [associatedProducts, setAssociatedProducts] = useState([]);

  // Fetch article data
  useEffect(() => {
    const getArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchArticle(articleId);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      getArticle();
    }
  }, [articleId]);

  // Loading state
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Chargement...</p>
    </div>;
  }

  // Error state
  if (error) {
    return <div className={styles.error}>Erreur: {error}</div>;
  }

  // No article found state
  if (!article) {
    return <div className={styles.error}>Article non trouvé</div>;
  }

  // Destructuration avec valeurs par défaut
  const { 
    title = '', 
    image_banner = '', 
    content = [], 
    faq = [], 
    product_ids = [] 
  } = article;

  // Fetch associated products
  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (product_ids?.length > 0) {
        try {
          const productRequests = product_ids.map(async (productId) => {
            try {
              const response = await fetch(`https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/products/${productId}`);
              if (!response.ok) return null;
              return await response.json();
            } catch (error) {
              return null;
            }
          });
  
          const productsData = (await Promise.all(productRequests)).filter(Boolean);
          setAssociatedProducts(productsData);
        } catch (error) {
          setError("Impossible de charger les produits associés");
        }
      }
    };
  
    fetchAssociatedProducts();
  }, [product_ids]);

  const sectionRefs = useRef(content.map(() => React.createRef()));

  const scrollToSection = (index) => {
    const section = sectionRefs.current[index]?.current;
    if (section) {
      const yOffset = -150;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderTableOfContents = () => {
    const headers = content.filter(item => 
      item.type === 'header' && (item.level === 1 || item.level === 2)
    );

    if (headers.length === 0) return null;

    return (
      <div className={styles.tableOfContents}>
        <h2 className={styles.tocTitle}>Sommaire</h2>
        <ul className={styles.tocList}>
          {headers.map((header, index) => (
            <li key={index} className={styles.tocItem}>
              <button onClick={() => scrollToSection(index)}>
                {header.data}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const ScrollAnimationWrapper = ({ children }) => {
    const ref = useRef(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

    return (
      <div ref={ref} className={`${styles.fadeIn} ${isVisible ? styles.visible : ''}`}>
        {children}
      </div>
    );
  };

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case 'header':
        const HeaderTag = `h${contentItem.level}`;
        return (
          <ScrollAnimationWrapper>
            <HeaderTag className={`${styles.sectionHeader} ${styles[`h${contentItem.level}`]}`}>
              {contentItem.data}
            </HeaderTag>
          </ScrollAnimationWrapper>
        );
      
      case 'text':
        return contentItem.data.content.map((textContent, index) => {
          if (textContent.type === 'paragraph') {
            return (
              <ScrollAnimationWrapper key={index}>
                <div className={styles.paragraphBox}>
                  {textContent.sentences.map((sentence, sentenceIndex) => (
                    <p key={sentenceIndex} className={styles.sentence}>
                      {sentence}
                    </p>
                  ))}
                </div>
              </ScrollAnimationWrapper>
            );
          }
          if (textContent.type === 'list') {
            return (
              <ScrollAnimationWrapper key={index}>
                <div className={styles.paragraphBox}>
                  <ul className={styles.list}>
                    {textContent.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollAnimationWrapper>
            );
          }
          return null;
        });
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.articleWrapper}>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{title}</h1>
          {image_banner && (
            <div className={styles.bannerContainer}>
              <img 
                src={image_banner}
                alt={title}
                className={styles.bannerImage}
              />
            </div>
          )}
        </header>
        {renderTableOfContents()}
        <div className={styles.contentContainer}>
          {content.map((contentItem, index) => (
            <div key={index} ref={sectionRefs.current[index]}>
              {renderContent(contentItem)}
            </div>
          ))}
        </div>
        {renderAssociatedProducts()}
        {renderFAQ()}
      </article>
    </div>
  );
};

export default BlogArticle;