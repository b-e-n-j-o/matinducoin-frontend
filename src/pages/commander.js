import React from 'react';
import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';

const Order = () => {
  return (
    <div className="pt-0"> {/* Ajout de padding-top */}
        <Navbar />
      <div className="container mx-auto p-4">
        <OrderForm />
      </div>
    </div>
  );
};

export default Order;
