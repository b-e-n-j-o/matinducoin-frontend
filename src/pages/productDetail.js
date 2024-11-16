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
      // Si le produit existe déjà, mettez à jour sa quantité
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Sinon, ajoutez le nouveau produit au panier
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-10">{product.name}</h1>
        <div className="product-detail-images flex justify-center">
          {product.images.map((image, index) => (
            <img key={index} src={image} alt={`${product.name} ${index + 1}`} className="w-48 h-48 object-cover mx-2" />
          ))}
        </div>
        <p className="text-center text-gray-700 my-4">{product.description}</p>
        <p className="text-center text-gray-900 font-bold my-2">Prix : {product.price} €</p>
        <p className="text-center text-gray-700 my-2">Options d'achat : {product.purchaseOptions.join(', ')}</p>

        <div className="flex justify-center items-center my-4">
          <label htmlFor="quantity" className="mr-2">Quantité:</label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <button
            onClick={addToCart}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ajouter au panier
          </button>
        </div>

        <ReviewForm productId={product._id} />
        <ReviewList productId={product._id} />
      </main>
    </div>
  );
};

export default ProductDetail;