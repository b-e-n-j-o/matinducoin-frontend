import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (id) {
      // Récupération du produit
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Produit non trouvé');
          }
          return response.json();
        })
        .then(data => setProduct(data))
        .catch(error => {
          console.error('Erreur lors de la récupération du produit:', error);
          setError(error.message);
        });
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

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert('Une erreur est survenue lors de l\'ajout au panier');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <p style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <p style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} className="text-xl text-orange-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white/20 rounded-xl shadow-lg p-6 my-10">
          {/* En-tête du produit */}
          <div className="text-center mb-8 bg-orange-100/50 p-6 rounded-lg border border-orange-200">
            <div className="max-w-3xl mx-auto">
              <h1 style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} className="text-4xl text-orange-500 mb-4">{product.name}</h1>
              <p style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} className="text-xl text-gray-700 max-w-2xl mx-auto">{product.description}</p>
            </div>
          </div>

          {/* Conteneur pour les images et le prix */}
          <div className="bg-orange-100/50 p-6 rounded-lg border border-orange-200 mb-8">
            {/* Images du produit */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {Array.isArray(product.images) && product.images.map((image, index) => (
                <div 
                  key={index} 
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedImage(image)}
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
            <div className="text-center">
              <p style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} className="text-3xl text-orange-500">{product.price} $</p>
            </div>
          </div>

          {/* Modal pour l'image agrandie */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-3xl max-h-[80vh] w-full">
                <img 
                  src={selectedImage} 
                  alt="Image agrandie"
                  className="w-full h-full object-scale-down"
                />
                <button 
                  className="absolute top-4 right-4 text-white text-xl bg-black bg-opacity-50 w-8 h-8 rounded-full"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Description détaillée */}
          {product.detailed_desc && (
            <div className="bg-orange-50/80 p-6 rounded-lg mb-8">
              <div 
                style={{ fontFamily: "'Bobby Jones Soft', sans-serif", lineHeight: '1.8' }}
                className="whitespace-pre-line text-gray-700 space-y-1"
              >
                {product.detailed_desc}
              </div>
            </div>
          )}

          {/* Section achat */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-4">
              <label style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }} htmlFor="quantity" className="text-lg text-gray-700">
                Nombre de shots
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }}
                className="border-2 border-orange-200 rounded-lg px-4 py-2 text-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1 === 7 ? 'Rabais formule semaine' : `${i + 1} ${i + 1 === 1 ? 'shot' : 'shots'}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addToCart}
              style={{ fontFamily: "'Bobby Jones Soft', sans-serif" }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg transform hover:scale-105 transition-all"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}