import React, { useState, useEffect } from 'react';
import OrderForm from '../components/OrderForm';
import OrderChat from '../components/OrderChat';
import Navbar from '../components/Navbar'; // Importation du composant Navbar

const OrderPage = () => {
  const [orderMethod, setOrderMethod] = useState('form');
  const [isLoaded, setIsLoaded] = useState(false);

  // Supprimer le comportement de descente forcée au chargement
  useEffect(() => {
    const preventScrollOnLoad = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    // Éviter tout défilement forcé seulement au premier chargement
    window.addEventListener('scroll', preventScrollOnLoad);
    
    setTimeout(() => {
      window.removeEventListener('scroll', preventScrollOnLoad);
    }, 100); // Supprimer rapidement le listener après le premier rendu

    setIsLoaded(true); // Confirmer que la page est chargée
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar ajoutée en haut */}
      <Navbar />
      <div className="py-12">
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
              {isLoaded && (
                <>
                  <div
                    className={`transition-all duration-300 ${
                      orderMethod === 'form' 
                        ? 'opacity-100 z-10 relative'
                        : 'opacity-0 z-0 absolute inset-0'
                    }`}
                  >
                    <OrderForm />
                  </div>
                  <div
                    className={`transition-all duration-300 ${
                      orderMethod === 'chat'
                        ? 'opacity-100 z-10 relative'
                        : 'opacity-0 z-0 absolute inset-0'
                    }`}
                  >
                    <OrderChat className="h-full" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
