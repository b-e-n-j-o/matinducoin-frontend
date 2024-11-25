import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ProductFeatures = ({ features }) => {
  if (!features) return null;

  return (
    <div className="space-y-6">
      {Object.values(features).map((section, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-bold text-orange-500 mb-3">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start text-gray-700"
              >
                <span className="mr-3 ml-4">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
        .then(response => response.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  if (!product) return (
    <div className="min-h-screen bg-amber-50 flex justify-center items-center">
      <p className="text-xl text-orange-500">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-10">
          {/* En-tête du produit */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">{product.description}</p>
          </div>

          {/* Images du produit */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {product.images?.map((image, index) => (
              <div 
                key={index} 
                className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-48 h-48 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Prix du produit */}
          <div className="text-center mb-8">
            <p className="text-3xl font-bold text-orange-500">{product.price} €</p>
          </div>

          {/* Ingrédients */}
          {product.ingredients && (
            <div className="text-center mb-8 bg-orange-50 py-4 rounded-lg">
              <p className="text-lg font-bold text-orange-500">
                INGRÉDIENTS
              </p>
              <p className="text-gray-700 mt-2">
                {product.ingredients}
              </p>
            </div>
          )}

          {/* Caractéristiques du produit */}
          {product.features && (
            <div className="bg-orange-50 p-6 rounded-lg mb-8">
              <ProductFeatures features={product.features} />
            </div>
          )}

          {/* Section achat */}
          <div className="flex flex-col items-center gap-4 mt-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <label htmlFor="quantity" className="text-lg font-medium text-gray-700">
                Nombre de shots :
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border-2 border-orange-200 rounded-lg px-4 py-2 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? 'shot' : 'shots'}
                  </option>
                ))}
              </select>
              <button
                onClick={addToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium transform hover:scale-105 transition-all"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        {/* Section avis */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-10">
          <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">Avis clients</h2>
          <ReviewForm productId={product._id} />
          <ReviewList productId={product._id} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;