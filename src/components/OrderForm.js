import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const OrderForm = () => {
  const router = useRouter();
  const { flavor: initialFlavor } = router.query;
  const [formData, setFormData] = useState({
    reveilSoleil: '0', matchaMatin: '0', berryBalance: '0',
    deliveryDate: '', name: '', address: '', email: '', 
    promoCode: '', comment: ''
  });

  const products = [
    { id: 'reveilSoleil', name: 'Réveil Soleil', description: 'Shot énergisant au gingembre' },
    { id: 'matchaMatin', name: 'Matcha Matin', description: 'Shot au matcha et gingembre' },
    { id: 'berryBalance', name: 'Berry Balance', description: 'Shot aux baies et gingembre' }
  ];

  const getNextDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    
    for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if ((day === 1 || day === 4) && d >= today) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const initialQuantities = cartItems.reduce((acc, item) => {
      const key = {
        'Réveil Soleil': 'reveilSoleil',
        'Matcha Matin': 'matchaMatin',
        'Berry Balance': 'berryBalance'
      }[item.name];
      if (key) acc[key] = item.quantity.toString();
      return acc;
    }, {});
    setFormData(prev => ({ ...prev, ...initialQuantities }));
  }, []);

  useEffect(() => {
    if (initialFlavor) {
      setFormData(prev => ({ ...prev, [initialFlavor]: '1' }));
    }
  }, [initialFlavor]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasProducts = ['reveilSoleil', 'matchaMatin', 'berryBalance']
      .some(key => formData[key] !== '0');

    if (!hasProducts) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    const apiData = {
      ...formData,
      deliveryDate: new Date(formData.deliveryDate).toISOString(),
      flavor: ['reveilSoleil', 'matchaMatin', 'berryBalance']
        .filter(key => formData[key] !== '0')
        .map(key => `${key.toLowerCase()}:${formData[key]}`)
        .join(', '),
      reveilSoleil: parseInt(formData.reveilSoleil),
      matchaMatin: parseInt(formData.matchaMatin),
      berryBalance: parseInt(formData.berryBalance)
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notify-owner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData),
        });
        alert('Commande passée avec succès!');
        router.push(`/OrderConfirmation?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la commande: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      alert(`Erreur lors de la commande: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
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
                    onChange={(e) => handleInputChange({ target: { name: product.id, value: e.target.value }})}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i.toString()}>{i}</option>
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
                Date de livraison (Lundi et Jeudi uniquement)
              </label>
              <select
                id="deliveryDate"
                name="deliveryDate"
                required
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
              >
                <option value="">Sélectionnez une date</option>
                {getNextDeliveryDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </option>
                ))}
              </select>
            </div>

            {[
              { id: 'name', label: 'Votre prénom', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'promoCode', label: 'Code Promo', type: 'text', required: false }
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  required={field.required !== false}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
                />
              </div>
            ))}

            {['address', 'comment'].map(field => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field === 'address' ? 'Adresse de livraison' : 'Ajouter un commentaire, une demande (facultatif)'}
                </label>
                <textarea
                  id={field}
                  name={field}
                  required={field === 'address'}
                  value={formData[field]}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder={field === 'address' ? "Format: Numéro, Rue, Code postal (ex: 123 Rue Saint-Laurent, H2T 1R3)" : ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ff5900] focus:border-[#ff5900]"
                />
              </div>
            ))}
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
  );
};

export default OrderForm;