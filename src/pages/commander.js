// pages/order.js
import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import OrderChat from '../components/OrderChat';

const OrderPage = () => {
  const [orderMethod, setOrderMethod] = useState('form');

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Commander</h1>
          
          {/* Toggles de sélection */}
          <div className="mb-8">
            <div className="flex bg-white rounded-lg overflow-hidden border border-[#ff5900]">
              <button
                onClick={() => setOrderMethod('form')}
                className={`flex-1 py-4 px-6 text-center transition-all duration-200 font-semibold ${
                  orderMethod === 'form'
                    ? 'bg-[#ff5900] text-[#ffd97f]'
                    : 'bg-white text-[#ff5900] hover:bg-[#fff5e6]'
                }`}
              >
                Commander par formulaire
              </button>
              <button
                onClick={() => setOrderMethod('chat')}
                className={`flex-1 py-4 px-6 text-center transition-all duration-200 font-semibold ${
                  orderMethod === 'chat'
                    ? 'bg-[#ff5900] text-[#ffd97f]'
                    : 'bg-white text-[#ff5900] hover:bg-[#fff5e6]'
                }`}
              >
                Commander par chat
              </button>
            </div>
          </div>

          {/* Zone de contenu avec transition */}
          <div className="relative min-h-[700px]">
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                orderMethod === 'form' ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <OrderForm />
            </div>
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                orderMethod === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <OrderChat className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;