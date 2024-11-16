import React from 'react';
import styles from '../styles/Article.module.css';
import Navbar from './Navbar';

const CustomArticleTemplate = ({ article }) => {
  return (
    <>
      <Navbar />
      <div className={styles.articleContainer}>
        <h1 className={styles.articleTitle}>{article.title}</h1>
        <img src={article.previewImg} alt={article.title} className={styles.articleImage} />
        <div 
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </div>
    </>
  );
};

export default CustomArticleTemplate;