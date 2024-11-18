import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      <h1 className="text-3xl font-bold my-8 text-green-600">Nos  Shots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card 
            key={product._id}
            className={`transform transition-all duration-300 bg-yellow-100 ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Link href={`/products/${product._id}`} passHref>
              <CardHeader className="p-0 cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-center p-4">{product.description}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mt-4 px-4 text-orange-600 hover:underline">{product.name}</h3>
              </CardHeader>
            </Link>
            <CardContent>
              <p className="font-bold mt-2 text-green-700">{product.price.toFixed(2)} €</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Ajouter au panier</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;