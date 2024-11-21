import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './BlogArticle.module.css';
import { fetchProduct } from '../../pages/api/utils/api'; // Chemin correct

const BlogArticle = ({ article }) => {
  const [associatedProducts, setAssociatedProducts] = useState([]);
  const [error, setError] = useState(null);

  // Destructure les données de l'article
  const { title, image_banner, content, product_ids } = article;

  // Chargement des produits associés à l'article
  useEffect(() => {
    const fetchAssociatedProducts = async () => {
      if (!product_ids || product_ids.length === 0) return;

      try {
        const products = await Promise.all(product_ids.map((id) => fetchProduct(id)));
        setAssociatedProducts(products);
      } catch (error) {
        console.error('Erreur lors du chargement des produits associés :', error);
        setError('Impossible de charger les produits associés');
      }
    };

    fetchAssociatedProducts();
  }, [product_ids]);

  // Gestion de l'article non trouvé
  if (!article) {
    return <div className={styles.error}>Article non trouvé</div>;
  }

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

        {/* Affichage du contenu de l'article */}
        <div className={styles.contentContainer}>
          {content.map((section, index) => {
            if (section.type === 'header') {
              return <h2 key={index}>{section.data}</h2>;
            }
            if (section.type === 'text') {
              return (
                <p key={index}>
                  {section.data.content.map((paragraph, i) => (
                    <span key={i}>{paragraph.sentences.join(' ')}</span>
                  ))}
                </p>
              );
            }
            return null;
          })}
        </div>

        {/* Affichage des produits associés */}
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          associatedProducts.length > 0 && (
            <div className={styles.productsWrapper}>
              <h2>Produits associés :</h2>
              <div className={styles.productCards}>
                {associatedProducts.map((product) => (
                  <div key={product._id} className={styles.productCard}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </article>
    </div>
  );
};

export default BlogArticle;
