import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrderForm = () => {
  const router = useRouter();
  const { flavor: initialFlavor } = router.query;
  const [error, setError] = useState(false);
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

  const handleQuantityChange = (value, productId) => {
    setFormData(prevData => ({
      ...prevData,
      [productId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données du formulaire brutes:', formData);

    // Vérification des produits sélectionnés
    const hasProducts = Object.entries(formData)
      .filter(([key]) => ['reveilSoleil', 'matchaMatin', 'berryBalance'].includes(key))
      .some(([_, value]) => value !== '0');

    if (!hasProducts) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    // Vérification des champs requis
    const requiredFields = ['name', 'address', 'deliveryDate', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      console.log('Champs manquants:', missingFields);
      alert(`Veuillez remplir les champs suivants : ${missingFields.join(', ')}`);
      return;
    }

    // Déterminer le produit principal (le premier avec une quantité > 0)
    const selectedProducts = Object.entries(formData)
      .filter(([key, value]) => ['reveilSoleil', 'matchaMatin', 'berryBalance'].includes(key) && value !== '0')
      .sort((a, b) => parseInt(b[1]) - parseInt(a[1])); // Trier par quantité décroissante

    if (selectedProducts.length === 0) {
      alert('Veuillez sélectionner au moins un produit');
      return;
    }

    // Créer l'objet de données formaté pour l'API
    const apiData = {
      name: formData.name,
      address: formData.address,
      deliveryDate: new Date(formData.deliveryDate).toISOString(),
      email: formData.email,
      flavor: selectedProducts[0][0], // Utiliser le produit avec la plus grande quantité comme flavor principal
      promoCode: formData.promoCode || undefined,
      orderTime: new Date().toISOString(),
      // Ajouter les quantités comme métadonnées supplémentaires si nécessaire
      orderDetails: {
        reveilSoleil: parseInt(formData.reveilSoleil),
        matchaMatin: parseInt(formData.matchaMatin),
        berryBalance: parseInt(formData.berryBalance)
      }
    };

    console.log('Données formatées pour API:', apiData);

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
        const errorText = await response.text();
        console.error("Erreur lors de l'envoi de la notification au propriétaire:", errorText);
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
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Votre Commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Sélectionnez vos produits</h3>
                <div className="grid gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.description}</p>
                      </div>
                      <div className="w-24">
                        <Select 
                          value={formData[product.id]} 
                          onValueChange={(value) => handleQuantityChange(value, product.id)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Qté" />
                          </SelectTrigger>
                          <SelectContent>
                            {quantities.map((qty) => (
                              <SelectItem key={qty} value={qty}>
                                {qty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderForm;