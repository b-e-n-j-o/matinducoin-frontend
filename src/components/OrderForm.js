import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import OrderChat from './OrderChat';  // Import du composant de chat

const OrderForm = () => {
  const router = useRouter();
  const { flavor: initialFlavor } = router.query;
  const [error, setError] = useState(false);
  const [orderMethod, setOrderMethod] = useState('form'); // Ajout de l'état pour la méthode de commande
  const [formData, setFormData] = useState({
    reveilSoleil: '0',
    matchaMatin: '0', 
    berryBalance: '0',
    deliveryDate: '',
    name: '',
    address: '',
    email: '',
    promoCode: ''
  });

  const products = [
    { id: 'reveilSoleil', name: 'Réveil Soleil', description: 'Jus énergisant pour bien commencer la journée' },
    { id: 'matchaMatin', name: 'Matcha Matin', description: 'Boost naturel au matcha' },
    { id: 'berryBalance', name: 'Berry Balance', description: 'Mélange équilibré de baies antioxydantes' }
  ];

  const quantities = Array.from({ length: 11 }, (_, i) => i.toString());

  useEffect(() => {
    if (initialFlavor) {
      setFormData(prevData => ({
        ...prevData,
        [initialFlavor]: '1'
      }));
    }
  }, [initialFlavor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleQuantityChange = (e, productId) => {
    const value = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      [productId]: value
    }));
  };

  const generateFlavorString = () => {
    const flavorParts = [];
    if (parseInt(formData.reveilSoleil) > 0) {
      flavorParts.push(`reveil soleil:${formData.reveilSoleil}`);
    }
    if (parseInt(formData.matchaMatin) > 0) {
      flavorParts.push(`matcha matin:${formData.matchaMatin}`);
    }
    if (parseInt(formData.berryBalance) > 0) {
      flavorParts.push(`berry balance:${formData.berryBalance}`);
    }
    return flavorParts.join(', ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasProducts = Object.entries(formData)
      .filter(([key]) => ['reveilSoleil', 'matchaMatin', 'berryBalance'].includes(key))
      .some(([_, value]) => value !== '0');

    if (!hasProducts) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    const flavorString = generateFlavorString();
    console.log('Résumé de la commande:', flavorString);

    const apiData = {
      name: formData.name,
      address: formData.address,
      deliveryDate: new Date(formData.deliveryDate).toISOString(),
      email: formData.email,
      flavor: flavorString,
      promoCode: formData.promoCode || undefined,
      reveilSoleil: parseInt(formData.reveilSoleil),
      matchaMatin: parseInt(formData.matchaMatin),
      berryBalance: parseInt(formData.berryBalance)
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (response.ok) {
        await sendOwnerNotification(apiData);
        alert('Commande passée avec succès!');
        router.push(`/OrderConfirmation?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
      } else {
        const errorData = await response.json();
        console.error('Erreur de réponse:', errorData);
        alert(`Erreur lors de la commande: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      alert(`Erreur lors de la commande: ${error.message}`);
    }
  };

  const sendOwnerNotification = async (orderData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notify-owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Notification au propriétaire envoyée avec succès:', data);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification au propriétaire:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec choix de méthode */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Commander</h1>
          
          {/* Toggle buttons */}
          <div className="flex border border-gray-200 rounded-lg p-1 bg-white shadow-sm mb-6">
            <button
              onClick={() => setOrderMethod('form')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                orderMethod === 'form'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Commander par formulaire
            </button>
            <button
              onClick={() => setOrderMethod('chat')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                orderMethod === 'chat'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Commander par chat
            </button>
          </div>

          {/* Container avec animation pour le formulaire et le chat */}
          <div className="relative overflow-hidden bg-white shadow-lg rounded-lg">
            {/* Formulaire */}
            <div
              className={`transition-all duration-500 ${
                orderMethod === 'form'
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-full opacity-0 absolute inset-0'
              }`}
            >
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Sélectionnez vos produits</h3>
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                          <div className="w-24">
                            <select
                              value={formData[product.id]}
                              onChange={(e) => handleQuantityChange(e, product.id)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {quantities.map((qty) => (
                                <option key={qty} value={qty}>
                                  {qty}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Informations de livraison</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
                          Date de livraison
                        </label>
                        <input
                          type="date"
                          id="deliveryDate"
                          name="deliveryDate"
                          required
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Adresse de livraison
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">
                          Code Promo
                        </label>
                        <input
                          type="text"
                          id="promoCode"
                          name="promoCode"
                          value={formData.promoCode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Confirmer ma commande
                  </button>
                </form>
              </div>
            </div>

            {/* Chat */}
            <div
              className={`transition-all duration-500 ${
                orderMethod === 'chat'
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0 absolute inset-0'
              }`}
            >
              <OrderChat typingSpeed={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;