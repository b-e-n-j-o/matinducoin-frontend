// Products.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Utilisation d'une fonction pour obtenir l'URL de l'API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Ajoutez d'autres headers si nécessaire
          },
        });
        
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
      <div className="min-h-screen flex items-center justify-center bg-custom-yellow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-yellow">
        <div className="text-custom-orange text-center">
          <p className="font-bobby text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-custom-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-[#ffd97f]">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="py-12 text-center w-full">
          <h1 className="font-['Bobby_Jones_Soft'] text-[rgb(255,89,0)] text-4xl md:text-5xl lg:text-6xl tracking-[30px] uppercase transform transition-all duration-300 text-center mx-auto px-4">
            Nos Recettes
          </h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link 
                href={`/products/${product._id}`} 
                key={product._id}
                className="group h-full"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <article className={`bg-white/20 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ${!isMobile ? 'hover:scale-105 hover:shadow-xl' : ''} h-full flex flex-col`}>
                  <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-transform duration-500 ${!isMobile ? 'group-hover:scale-110' : ''}`}
                      priority={index === 0}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    
                    <div className="absolute inset-0" />
                  </div>

                  <div className="relative p-6 flex flex-col flex-grow">
                    <h3 className={`font-['Bobby_Jones_Soft'] text-[rgb(255,89,0)] text-xl sm:text-2xl tracking-[10px] uppercase text-center mb-4 transition-all duration-300 ${!isMobile ? 'group-hover:scale-110' : ''}`}>
                      {product.name}
                    </h3>
                    
                    <div className="bg-white/40 rounded-lg p-4 flex-grow">
                      <p className="font-['Bobby_Jones_Soft'] text-gray-700 text-sm tracking-wide text-center line-clamp-3">
                        {product.ingredients}
                      </p>
                    </div>

                    {product.price && (
                      <p className="mt-4 text-[rgb(255,89,0)] text-xl font-bold text-center">
                        {product.price.toFixed(2)} €
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center mt-8">
            <p className="text-gray-500 font-bobby text-xl">
              Aucune recette disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;