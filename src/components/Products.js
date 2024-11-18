import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/Products.module.css';
import 'tailwindcss/tailwind.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
      console.log('Tentative de fetch vers:', apiUrl); // Pour voir l'URL complète
      try {
        const response = await fetch(apiUrl);
        console.log('Status de la réponse:', response.status);

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données produits récupérées :', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Les données reçues ne sont pas au format attendu');
        }
        
        setProducts(data);
        setVisible(true);
        setError(null);
      } catch (error) {
        console.error('Échec de la récupération des produits :', error);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className={`${styles.titleContainer} text-center`}>
          <h1 className={`${styles.title} text-3xl sm:text-4xl font-fungroovy text-orange-600`}>
            Nos Recettes
          </h1>
        </div>
        
        <div className={`${styles.container} mt-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Link href={`/products/${product._id}`} key={product._id} passHref>
                <article 
                  className={`${styles.card__article} bg-white rounded-lg shadow-md overflow-hidden 
                    transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-[500px]`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <div className="relative w-full h-[400px]">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      layout="fill"
                      objectFit="cover"
                      className={`${styles.card__img}`}
                      priority={true}
                    />
                  </div>

                  <div className={`${styles.card__data} p-4`}>
                    <h3 className={`${styles.card__title} text-xl font-semibold text-orange-500 mb-2`}>
                      {product.name}
                    </h3>
                    <p className={`${styles.card__ingredients} text-gray-700 text-sm line-clamp-2`}>
                      {product.ingredients}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center mt-8">
            <p className="text-gray-500">Aucune recette disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;