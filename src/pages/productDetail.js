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

  const ProductSection = ({ title, children, className = "" }) => (
    <div className={`mb-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-orange-500 mb-3">{title}</h3>}
      {children}
    </div>
  );

  const ProductImage = ({ src, alt, index }) => (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <img 
        src={src} 
        alt={alt} 
        className="w-48 h-48 object-cover"
      />
    </div>
  );

  const ProductFeaturesList = ({ features }) => {
    if (!features) return null;
    
    // Divise le texte en sections basées sur les emojis ou les sauts de ligne
    const sections = features.split(/\n(?=[✨🌿♻️💚])/);
    
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const title = lines[0];
      const items = lines.slice(1).filter(line => line.trim());

      return (
        <ProductSection key={index} title={title}>
          <div className="whitespace-pre-line text-gray-700 ml-4">
            {items.map((item, idx) => (
              item.startsWith('-') ? item.trim() : `- ${item.trim()}`
            )).join('\n')}
          </div>
        </ProductSection>
      );
    });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-10">
          {/* En-tête du produit */}
          <ProductSection className="text-center">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700">{product.description}</p>
          </ProductSection>

          {/* Images du produit */}
          <ProductSection className="flex justify-center gap-4">
            {product.images?.map((image, index) => (
              <ProductImage 
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                index={index}
              />
            ))}
          </ProductSection>

          {/* Ingrédients */}
          {product.ingredients && (
            <ProductSection className="text-center">
              <p className="text-orange-500 font-bold">
                INGRÉDIENTS : {product.ingredients}
              </p>
            </ProductSection>
          )}

          {/* Description détaillée */}
          {product.detailed_desc && (
            <ProductSection className="bg-orange-50 p-6 rounded-lg">
              <ProductFeaturesList features={product.detailed_desc} />
            </ProductSection>
          )}

          {/* Section achat */}
          <ProductSection className="flex flex-col items-center gap-4 mt-8">
            <p className="text-3xl font-bold text-orange-500">{product.price} €</p>
            
            <div className="flex items-center gap-4">
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
            </div>

            <button
              onClick={addToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-medium transform hover:scale-105 transition-all"
            >
              Ajouter au panier
            </button>
          </ProductSection>
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