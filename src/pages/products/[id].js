import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

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

  if (!product) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-10">
          <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">{product.name}</h1>
          
          <div className="product-detail-images flex justify-center gap-4 mb-8">
            {product.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-48 h-48 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-center text-gray-700 text-lg">{product.description}</p>
            <p className="text-center font-bold text-2xl text-orange-500">{product.price} €</p>
            
            {product.detailed_desc && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-700">{product.detailed_desc}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-lg font-medium text-gray-700">
                  Nombre de shots:
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
              </div>

              <button
                onClick={addToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium transform hover:scale-105 transition-all"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <ReviewForm productId={product._id} />
          <ReviewList productId={product._id} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;