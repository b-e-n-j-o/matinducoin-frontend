import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/ProductDetail.module.css';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProductAndRelated = async () => {
        try {
          // Récupération du produit principal
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
          const data = await response.json();
          console.log('Produit récupéré :', data);
          setProduct(data);
  
          // Récupération des produits associés
          if (data.product_ids && data.product_ids.length > 0) {
            const relatedPromises = data.product_ids
              .filter(relatedId => relatedId !== id)
              .map(relatedId => 
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${relatedId}`).then(res => res.json())
              );
            const relatedData = await Promise.all(relatedPromises);
            console.log('Produits associés :', relatedData);
            setRelatedProducts(relatedData);
          }
        } catch (error) {
          console.error('Failed to fetch product or related products:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProductAndRelated();
    }
  }, [id]);

  const keyWords = ["Ingrédients : Gingembre, Curcuma, Citron ;"]
  
  const addToCart = () => {
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/panier');
  };

  const highlightKeywords = (text) => {
    const regex = new RegExp(`\\b(${keyWords.join('|')})\\b`, 'gi');
    
    return (
      <ul className={styles.detailedDescList}>
        {text.split('. ').map((sentence, index) => (
          <li key={index} className={`${styles.listItem} ${sentence.includes('Ingrédients') ? styles.ingredients : ''}`}>
            {sentence.split(' ').map((word, wordIndex) => {
              if (regex.test(word)) {
                return <span key={wordIndex} className={styles.keyword}>{word}</span>;
              }
              return word + ' ';
            })}
            {index < text.split('. ').length - 1 ? '.' : ''}
          </li>
        ))}
      </ul>
    );
  };
  
  

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderAssociatedProducts = () => {
    if (relatedProducts.length === 0) return null;

    return (
      <div className={styles.productsWrapper}>
        <h2 className={styles.randomProductTitle}>Produits associés :</h2>
        <div className={styles.productCardsContainer}>
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit non trouvé</p>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            {/* Add your logo here */}
          </div>
          <button className={styles.menuButton}>
            {/* Add menu icon or text */}
          </button>
        </div>
        
        <div className={styles.productContent}>
          <div className={styles.carousel}>
            <button onClick={handlePrevImage} className={styles.carouselButton}>❮</button>
            <div className={styles.carouselImageContainer} onClick={openModal}>
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className={styles.carouselImage}
              />
            </div>
            <button onClick={handleNextImage} className={styles.carouselButton}>❯</button>
          </div>
  
          <div className={styles.detailsSection}>
  <h1 className={styles.title}>{product.name}</h1>
  
  <Link href={`/articles/${product.articleId}`}>
    <div 
      className={`${styles.description} ${styles.descriptionBox}`}
      onMouseEnter={() => !isMobile && setShowMoreInfo(true)}
      onMouseLeave={() => !isMobile && setShowMoreInfo(false)}
    >
      {highlightKeywords(product.detailed_desc)}
      {(isMobile || showMoreInfo) && (
        <button className={styles.moreInfoLink}>
          En savoir plus
        </button>
      )}
    </div>
  </Link>
  
  {/* Phrase spéciale en dehors de la liste */}
  <h2 className={styles.specialPhrase}>SECOUEZ, BUVEZ, RAYONNEZ!</h2>
  
  <div className={styles.packSelection}>
    <select
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      className={styles.quantitySelect}
    >
      <option value={1}>Unité - {product.price} $ CAD</option>
      <option value={2}>2 shots - {(product.price * 2).toFixed(2)} $ CAD</option>
      <option value={3}>3 shots - {(product.price * 3).toFixed(2)} $ CAD</option>
      <option value={7}>Semaine complète (7 shots) - {(product.price * 7).toFixed(2)}$ CAD</option>
    </select>
  </div>

  <button className={styles.addToCartButton} onClick={addToCart}>
    Ajouter au panier
  </button>
</div>



        </div>
  
        {renderAssociatedProducts()}
  
        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                layout="responsive"
                width={800}
                height={600}
              />
              <button className={styles.closeModalButton} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
  

};

export default ProductDetail;