import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/ClickableImage.module.css';  // Assurez-vous que le chemin est correct

const ClickableImage = ({ _id, src, alt }) => {
    return (
      <Link href={`/articles/${_id}`}>
        <div className={styles.imageContainer}>
          <Image
            src={src}
            alt={alt}
            layout="responsive"
            objectFit="cover"  // Pour que l'image occupe tout l'espace et soit rognée
            objectPosition="center"  // Assure que le rognage se fait à partir du centre
            width={300}  // largeur fixe, ajustable selon ton design
            height={200} // hauteur fixe, ajustable selon ton design
            className={styles.image}
          />
          <div className={styles.overlay}>
            <span className={styles.overlayText}>Voir plus d'infos</span>
          </div>
        </div>
      </Link>
    );
};

export default ClickableImage;