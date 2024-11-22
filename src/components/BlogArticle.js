import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import ProductCard from './ProductCard';
import styles from './BlogArticle.module.css';
import { fetchArticle } from '../services/api';

// Helper pour gérer les URLs d'images
const getImageUrl = (imagePath) => {
  // Si l'URL est déjà absolue, la retourner telle quelle
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Sinon, construire l'URL complète
  return `https://matinducoin-backend-b2f47bd8118b.herokuapp.com${imagePath}`;
};

const BlogArticle = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [associatedProducts, setAssociatedProducts] = useState([]);

  // Fetch article data with better error handling
  useEffect(() => {
    const getArticle = async () => {
      try {
        console.log('Fetching article with ID:', articleId);
        setLoading(true);
        const data = await fetchArticle(articleId);
        console.log('Received article data:', data);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', {
          message: err.message,
          stack: err.stack
        });
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
        <p className="text-xl">Chargement de l'article...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.error}>
        Une erreur s'est produite : {error}
      </div>
    );
  }

  // No article state
  if (!article) {
    return <div className={styles.error}>Article non trouvé</div>;
  }

  // Destructure with validation
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
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
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

  // Render content with better error handling
  const renderContent = (contentItems) => {
    if (!Array.isArray(contentItems)) {
      console.error('Content is not an array:', contentItems);
      return null;
    }

    return contentItems.map((item, index) => {
      try {
        switch (item?.type) {
          case 'header':
            const HeaderTag = `h${item.level || 2}`;
            return (
              <div key={index} className={styles.sectionHeaderWrapper}>
                <HeaderTag className={`${styles.sectionHeader} ${styles[`h${item.level}`]}`}>
                  {item.data}
                </HeaderTag>
              </div>
            );
          
          case 'text':
            if (!item.data?.content) return null;
            
            return (
              <div key={index} className={styles.textContent}>
                {item.data.content.map((contentItem, contentIndex) => {
                  switch (contentItem.type) {
                    case 'paragraph':
                      return (
                        <div key={contentIndex} className={styles.paragraphBox}>
                          {contentItem.sentences.map((sentence, sentenceIndex) => (
                            <p key={sentenceIndex} className={styles.sentence}>
                              {sentence}
                            </p>
                          ))}
                        </div>
                      );
                    
                    case 'list':
                      return (
                        <div key={contentIndex} className={styles.paragraphBox}>
                          <ul className={styles.list}>
                            {contentItem.items.map((item, itemIndex) => (
                              <li key={itemIndex} className={styles.listItem}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    
                    default:
                      return null;
                  }
                })}
              </div>
            );

          default:
            return null;
        }
      } catch (error) {
        console.error(`Error rendering content item ${index}:`, error);
        return null;
      }
    });
  };

  return (
    <div className={styles.articleWrapper}>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{title}</h1>
          {image_banner && (
            <div className={styles.bannerContainer}>
              <img
                src={getImageUrl(image_banner)}
                alt="Bannière de l'article"
                className={styles.bannerImage}
              />
            </div>
          )}
        </header>
        <div className={styles.contentContainer}>
          {renderContent(content)}
        </div>
        {/* Products and FAQ sections removed for brevity */}
      </article>
    </div>
  );
};

export default BlogArticle;