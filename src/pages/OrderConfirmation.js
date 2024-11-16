// src/pages/OrderConfirmation.js

import { useRouter } from 'next/router';

const OrderConfirmation = () => {
  const router = useRouter();
  const { name, email } = router.query;

  // Extraire le prénom du nom complet
  const firstName = name?.split(' ')[0] || name;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Merci, {firstName}!</h1>
        <p className="mb-4">Votre commande a été passée avec succès.</p>
        <p>Vous pouvez retrouver les détails de votre commande par email à l'adresse suivante : <strong>{email}</strong></p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
