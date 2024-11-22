import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import styles from '../../styles/ProductDetail.module.css';
import { fetchProduct, fetchRelatedProducts } from '../../services/api';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        try {
          const productData = await fetchProduct(id);
          setProduct(productData);

          if (productData.product_ids && productData.product_ids.length > 0) {
            const relatedProductsData = await fetchRelatedProducts(
              productData.product_ids.filter((relatedId) => relatedId !== id)
            );
            setRelatedProducts(relatedProductsData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du produit ou des produits associés :', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [id]);

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

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const addToCart = () => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/panier');
  };

  if (loading) return <p>Chargement...</p>;
  if (!product) return <p>Produit non trouvé</p>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
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

          <div className={styles.productCard}>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.description}>{product.description}</p>
            <p className={styles.detailedDesc}>{product.detailed_desc}</p>
            <p className={styles.ingredients}>
              <strong>Ingrédients :</strong> {product.ingredients}
            </p>

            <Link href={`/articles/${product.articleId}`}>
              <a className={styles.articleLink}>Lire l'article associé</a>
            </Link>

            <div className={styles.packSelection}>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={styles.quantitySelect}
              >
                {product.purchaseOptions.map((option, index) => (
                  <option key={index} value={index + 1}>
                    {option} - {(product.price * (index + 1)).toFixed(2)} CAD
                  </option>
                ))}
              </select>
            </div>

            <button className={styles.addToCartButton} onClick={addToCart}>
              Ajouter au panier
            </button>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className={styles.relatedProducts}>
            <h2 className={styles.randomProductTitle}>Produits associés</h2>
            <div className={styles.relatedProductsList}>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent}>
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                layout="responsive"
                width={800}
                height={600}
              />
              <button onClick={closeModal} className={styles.closeModalButton}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
