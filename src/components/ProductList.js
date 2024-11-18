import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
        setVisible(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8 text-green-600">Nos Ginger Shots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div 
            key={product._id}
            className="bg-yellow-100 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Link href={`/products/${product._id}`}>
              <div className="cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 px-4 text-orange-600 hover:underline">
                  {product.name}
                </h3>
              </div>
            </Link>
            <div className="p-4">
              <p className="font-bold mt-2 text-green-700">{product.price.toFixed(2)} €</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mt-4">
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;