import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import ProductCard from './ProductCard';
import styles from './BlogArticle.module.css';

const BlogArticle = ({ article }) => {
  if (!article) {
    return <div className={styles.error}>Article non trouvé</div>;
  }

  const { title, image_banner, content, faq, product_ids } = article;

  const [associatedProducts, setAssociatedProducts] = useState([]);

  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (product_ids && product_ids.length > 0) {
        try {
          const productRequests = product_ids.map((productId) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`).then((response) => response.json())
          );
          const productsData = await Promise.all(productRequests);
          setAssociatedProducts(productsData);
        } catch (error) {
          console.error("Erreur lors de la récupération des produits associés :", error);
        }
      } else {
        console.log("Pas de product_ids disponibles.");
      }
    };

    fetchAssociatedProducts();
  }, [product_ids]);

  const sectionRefs = useRef(content.map(() => React.createRef()));

  const scrollToSection = (index) => {
    const section = sectionRefs.current[index].current;
    
    if (section) {
      const yOffset = -150;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const renderTableOfContents = () => (
    <div className={styles.tableOfContents}>
      <h2 className={styles.tocTitle}>Sommaire</h2>
      <ul className={styles.tocList}>
        {content.map((item, index) => {
          // On inclut maintenant les headers de tous les niveaux (par exemple, level 1 et level 2)
          if (item.type === 'header' && (item.level === 1 || item.level === 2)) {
            return (
              <li key={index} className={styles.tocItem}>
                <button onClick={() => scrollToSection(index)}>
                  {item.data}
                </button>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
  
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
    if (!Array.isArray(contentItems)) {
      console.error("Le contenu de l'article n'est pas un tableau:", contentItems);
      return <p className={styles.error}>Erreur: Le contenu de l'article n'est pas dans le format attendu.</p>;
    }

    return contentItems.map((item, index) => {
      switch (item.type) {
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
                {item.caption && <figcaption className={styles.imageCaption}>{item.caption}</figcaption>}
              </div>
            </ScrollAnimationWrapper>
          );
        default:
          return null;
      }
    });
  };

  const renderAssociatedProducts = () => {
    if (associatedProducts.length === 0) return null;

    return (
      <ScrollAnimationWrapper>
        <div className={styles.productsWrapper}>
          <h2 className={styles.randomProductTitle}>Produits associés :</h2>
          <div className={styles.productCardsContainer}>
            {associatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </ScrollAnimationWrapper>
    );
  };

  const renderFAQ = () => {
    if (!faq || faq.length === 0) return null;

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