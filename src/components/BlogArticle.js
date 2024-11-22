import React, { useState, useEffect } from 'react';
import { fetchArticle } from '../services/api';

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
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">Erreur: {error}</p>
    </div>;
  }

  if (!article) {
    return <div className="flex justify-center items-center min-h-screen">
      <p>Aucun article trouvé</p>
    </div>;
  }

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case 'header':
        const HeaderTag = `h${contentItem.level}`;
        return <HeaderTag className="text-2xl font-bold my-4">{contentItem.data}</HeaderTag>;
      
      case 'text':
        return contentItem.data.content.map((textContent, index) => {
          if (textContent.type === 'paragraph') {
            return <p key={index} className="my-4">
              {textContent.sentences.join(' ')}
            </p>;
          }
          if (textContent.type === 'list') {
            return <ul key={index} className="list-disc ml-6 my-4">
              {textContent.items.map((item, itemIndex) => (
                <li key={itemIndex} className="my-2">{item}</li>
              ))}
            </ul>;
          }
          return null;
        });
      
      default:
        return null;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {article.image_banner && (
        <img 
          src={article.image_banner} 
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      
      <h1 className="text-4xl font-bold mb-8">{article.title}</h1>
      
      <div className="prose max-w-none">
        {article.content.map((contentItem, index) => (
          <div key={index}>
            {renderContent(contentItem)}
          </div>
        ))}
      </div>
    </article>
  );
};

export default BlogArticle;