import React, { useState, useEffect, useRef } from 'react';
import { fetchArticle } from '../services/api';
import styles from './BlogArticle.module.css';

const BlogArticle = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>Erreur: {error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.errorContainer}>
        <p>Aucun article trouvé</p>
      </div>
    );
  }

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case 'header':
        const HeaderTag = `h${contentItem.level}`;
        return (
          <div className={styles.headerContainer}>
            <HeaderTag className={styles[`h${contentItem.level}`]}>
              {contentItem.data}
            </HeaderTag>
          </div>
        );
      
      case 'text':
        return contentItem.data.content.map((textContent, index) => {
          if (textContent.type === 'paragraph') {
            return (
              <div key={index} className={styles.paragraphContainer}>
                <p className={styles.paragraph}>
                  {textContent.sentences.join(' ')}
                </p>
              </div>
            );
          }
          if (textContent.type === 'list') {
            return (
              <div key={index} className={styles.listContainer}>
                <ul className={styles.list}>
                  {textContent.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          return null;
        });
      
      default:
        return null;
    }
  };

  return (
    <article className={styles.articleContainer}>
      <div className={styles.contentWrapper}>
        {article.image_banner && (
          <div className={styles.bannerWrapper}>
            <img 
              src={article.image_banner} 
              alt={article.title}
              className={styles.bannerImage}
            />
          </div>
        )}
        
        <h1 className={styles.title}>{article.title}</h1>
        
        <div className={styles.articleContent}>
          {article.content.map((contentItem, index) => (
            <div key={index} className={styles.contentItem}>
              {renderContent(contentItem)}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogArticle;