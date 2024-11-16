import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import des styles de base de Swiper

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simulation d'un appel à une API
    setProducts([
      {
        id: 1,
        name: 'Orange',
        description: 'Delicious and fresh orange.',
        imageUrl: 'https://i.ibb.co/SJPQcNZ/U3f818dc61b164bd3996575580efd2b4b6.jpg',
        price: '1,43 € / Kg',
      },
      {
        id: 2,
        name: 'Apple',
        description: 'Fresh green apple.',
        imageUrl: 'https://i.ibb.co/tYSXjj5/green-apples-1518268185-3638493.jpg',
        price: '1,19 € / Kg',
      },
    ]);
  }, []);

  return (
    <div className="slider-container">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product">
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <span>{product.price}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
