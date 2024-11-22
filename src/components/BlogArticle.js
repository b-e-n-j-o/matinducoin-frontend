import React, { useState, useEffect } from 'react';
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
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Chargement...</p>
    </div>;
  }

  if (error) {
    return <div className={styles.error}>Erreur: {error}</div>;
  }

  if (!article) {
    return <div className={styles.error}>Aucun article trouvé</div>;
  }

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case 'header':
        const HeaderTag = `h${contentItem.level}`;
        return (
          <div className={styles.sectionHeaderWrapper}>
            <HeaderTag className={`${styles.sectionHeader} ${styles[`h${contentItem.level}`]}`}>
              {contentItem.data}
            </HeaderTag>
          </div>
        );
      
      case 'text':
        return contentItem.data.content.map((textContent, index) => {
          if (textContent.type === 'paragraph') {
            return (
              <div key={index} className={styles.paragraphBox}>
                {textContent.sentences.map((sentence, sentenceIndex) => (
                  <p key={sentenceIndex} className={styles.sentence}>
                    {sentence}
                  </p>
                ))}
              </div>
            );
          }
          if (textContent.type === 'list') {
            return (
              <div key={index} className={styles.paragraphBox}>
                <ul className={styles.list}>
                  {textContent.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.listItem}>
                      {item}
                    </li>
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
    <div className={styles.articleWrapper}>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>{article.title}</h1>
          {article.image_banner && (
            <div className={styles.bannerContainer}>
              <img 
                src={article.image_banner}
                alt={article.title}
                className={styles.bannerImage}
              />
            </div>
          )}
        </header>
        
        <div className={styles.contentContainer}>
          {article.content.map((contentItem, index) => (
            <div key={index}>
              {renderContent(contentItem)}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogArticle;