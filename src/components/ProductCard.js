import React from 'react';
import Link from 'next/link';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
    if (!product) {
      return <div>Produit non trouvé</div>;
    }
  
    const { _id, name, description, imageUrl } = product;
  
    return (
      <div className={styles.cardWrapper}>
        <Link href={`/products/${_id}`}>
          <div className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={imageUrl} alt={name} className={styles.image} />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.productName}>{name}</h2>
              <p className={styles.productDescription}>{description}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

export default ProductCard;