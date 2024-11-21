import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import OrderChat from './OrderChat';

const OrderForm = () => {
  const router = useRouter();
  const { flavor: initialFlavor } = router.query;
  const [orderMethod, setOrderMethod] = useState('form');
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
    { id: 'reveilSoleil', name: 'Réveil Soleil', description: 'Shot énergisant au gingembre' },
    { id: 'matchaMatin', name: 'Matcha Matin', description: 'Shot au matcha et gingembre' },
    { id: 'berryBalance', name: 'Berry Balance', description: 'Shot aux baies et gingembre' }
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
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Commander</h1>
        
        {/* Toggles de sélection */}
        <div className="max-w-2xl mx-auto mb-8">
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

        {/* Conteneur principal avec effet de transition */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden min-h-[700px]">
            {/* Formulaire */}
            <div
              className={`absolute inset-0 transition-all duration-500 transform ${
                orderMethod === 'form' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
              }`}
            >
              <div className="p-8 w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* ... Contenu du formulaire existant ... */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Sélectionnez vos produits</h3>
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                          <div className="w-24">
                            <select
                              value={formData[product.id]}
                              onChange={(e) => handleQuantityChange(e, product.id)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
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
                    <h3 className="text-xl font-semibold text-gray-900">Informations de livraison</h3>
                    <div className="grid grid-cols-1 gap-6">
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ff5900] text-[#ffd97f] py-4 px-6 rounded-lg hover:bg-[#ff7a33] focus:outline-none focus:ring-2 focus:ring-[#ff5900] focus:ring-offset-2 transition-colors font-semibold text-lg"
                  >
                    Confirmer ma commande
                  </button>
                </form>
              </div>
            </div>

            {/* Chat */}
            <div
              className={`absolute inset-0 transition-all duration-500 transform ${
                orderMethod === 'chat' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
              }`}
            >
              <div className="h-full w-full max-w-2xl mx-auto">
                <OrderChat className="h-full rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;