import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.error}>
        Erreur: {error}
      </div>
    );
  }

  // No article found state
  if (!article) {
    return <div className={styles.error}>Article non trouvé</div>;
  }

  // Destructure article data with defaults
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
              console.error(`Erreur lors du chargement du produit ${productId}:`, error);
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
    try {
      const section = sectionRefs.current[index]?.current;
      if (section) {
        const yOffset = -150;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Erreur lors du défilement:', error);
    }
  };

  const renderTableOfContents = () => {
    if (!Array.isArray(content) || content.length === 0) return null;

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

  const renderContent = (contentItems) => {
    return contentItems.map((item, index) => {
      try {
        switch (item?.type) {
          case 'header':
            const HeaderTag = `h${item.level}`;
            return (
              <div key={index} ref={sectionRefs.current[index]} className={styles.sectionHeaderWrapper}>
                <ScrollAnimationWrapper>
                  <HeaderTag className={`${styles.sectionHeader} ${styles[`h${item.level}`]}`}>
                    {item.data}
                  </HeaderTag>
                </ScrollAnimationWrapper>
              </div>
            );
          case 'text':
            return (
              <div key={index} className={styles.textContent}>
                {item.data.content.map((contentItem, contentIndex) => {
                  switch (contentItem.type) {
                    case 'subtitle':
                      return (
                        <ScrollAnimationWrapper key={contentIndex}>
                          <h3 className={styles.subtitle}>
                            <ReactMarkdown>{contentItem.text}</ReactMarkdown>
                          </h3>
                        </ScrollAnimationWrapper>
                      );
                    case 'paragraph':
                      return (
                        <ScrollAnimationWrapper key={contentIndex}>
                          <div className={styles.paragraphBox}>
                            {contentItem.sentences.map((sentence, sentenceIndex) => (
                              <ReactMarkdown key={sentenceIndex} className={styles.sentence}>
                                {sentence}
                              </ReactMarkdown>
                            ))}
                          </div>
                        </ScrollAnimationWrapper>
                      );
                    case 'list':
                      return (
                        <ScrollAnimationWrapper key={contentIndex}>
                          <div className={styles.paragraphBox}>
                            <ul className={styles.list}>
                              {contentItem.items.map((listItem, itemIndex) => (
                                <li key={itemIndex} className={styles.listItem}>
                                  <ReactMarkdown>{listItem}</ReactMarkdown>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </ScrollAnimationWrapper>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            );
          case 'image':
            return (
              <ScrollAnimationWrapper key={index}>
                <div className={styles.imageContainer}>
                  <Image
                    src={item.data}
                    alt={item.caption || 'Image de l\'article'}
                    width={800}
                    height={600}
                    layout="responsive"
                    className={styles.image}
                  />
                  {item.caption && (
                    <figcaption className={styles.imageCaption}>{item.caption}</figcaption>
                  )}
                </div>
              </ScrollAnimationWrapper>
            );
          default:
            return null;
        }
      } catch (error) {
        console.error(`Erreur lors du rendu de l'élément ${index}:`, error);
        return (
          <div key={index} className={styles.error}>
            Erreur lors du rendu de cet élément
          </div>
        );
      }
    });
  };

  const renderAssociatedProducts = () => {
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    if (!associatedProducts?.length) return null;

    return (
      <ScrollAnimationWrapper>
        <div className={styles.productsWrapper}>
          <h2 className={styles.randomProductTitle}>Produits associés :</h2>
          <div className={styles.productCardsContainer}>
            {associatedProducts.map((product) => 
              product ? (
                <ProductCard key={product._id} product={product} />
              ) : null
            )}
          </div>
        </div>
      </ScrollAnimationWrapper>
    );
  };

  const renderFAQ = () => {
    if (!Array.isArray(faq) || faq.length === 0) return null;

    return (
      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Foire Aux Questions</h2>
        {faq.map((item, index) => (
          <ScrollAnimationWrapper key={index}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{item.question}</h3>
              <p className={styles.faqAnswer}>{item.answer}</p>
            </div>
          </ScrollAnimationWrapper>
        ))}
      </section>
    );
  };

  return (
    <div className={styles.articleWrapper}>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{title}</h1>
          {image_banner && (
            <div className={styles.bannerContainer}>
              <Image
                src={image_banner}
                alt="Bannière de l'article"
                layout="responsive"
                width={1200}
                height={400}
                className={styles.bannerImage}
              />
            </div>
          )}
        </header>
        {renderTableOfContents()}
        <div className={styles.contentContainer}>
          {renderContent(content)}
        </div>
        {renderAssociatedProducts()}
        {renderFAQ()}
      </article>
    </div>
  );
};

export default BlogArticle;