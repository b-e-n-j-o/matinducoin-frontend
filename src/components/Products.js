import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import styles from '../styles/Products.module.css';
import 'tailwindcss/tailwind.css';

const Products = () => {
  const [products, setProducts] = useState([]); // State pour stocker les produits
  const [loading, setLoading] = useState(true); // State pour le chargement
  const [visible, setVisible] = useState(false); // State pour gérer la visibilité des cartes

  // Utilisation du hook useEffect pour récupérer les produits lors du montage du composant
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        const data = await response.json();
        console.log('Données produits récupérées :', data); // Log pour voir les produits récupérés
        setProducts(data); // Mise à jour du state avec les produits
        setVisible(true); // Affiche les produits
      } catch (error) {
        console.error('Échec de la récupération des produits :', error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchProducts(); // Appel de la fonction pour récupérer les produits
  }, []); // Ce useEffect ne s'exécutera qu'une seule fois (lors du montage)

  // Affiche un loader si les produits sont en cours de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Rendu de la liste des produits après chargement
  return (
    <div className="min-h-screen flex flex-col font-roboto">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className={`${styles.titleContainer} text-center`}>
          <h1 className={`${styles.title} text-3xl sm:text-4xl font-fungroovy text-orange-600`}>Nos Recettes</h1>
        </div>
        <div className={`${styles.container} mt-8`}>
          <div className={`${styles.card__container} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {Array.isArray(products) && products.map((product, index) => (
              <Link href={`/products/${product._id}`} key={product._id} passHref>
                <article 
                  className={`${styles.card__article} bg-transparent rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105`} 
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Conteneur de l'image */}
                  <div className="relative w-full h-0 pb-[80%]">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      layout="fill"
                      objectFit="cover"
                      className={`${styles.card__img}`}
                    />
                  </div>

                  {/* Conteneur du texte (en dessous de l'image) */}
                  <div className={`${styles.card__data} p-4`}>
                    <h3 className={`${styles.card__title} text-xl font-semibold text-orange-500`}>{product.name}</h3>
                    <p className={`${styles.card__ingredients} text-gray-700`}>{product.ingredients}</p>

                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
