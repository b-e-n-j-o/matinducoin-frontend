import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Order.module.css';

const OrderForm = () => {
  const router = useRouter();
  const { flavor: initialFlavor } = router.query;
  const [error, setError] = useState(false);
  const [promoValidation, setPromoValidation] = useState({ valid: null, message: '' });
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    deliveryDate: '',
    email: '',
    flavor: initialFlavor || '',
    promoCode: ''
  });

  const fieldLabels = {
    name: 'Ton nom',
    address: 'Ton adresse',
    deliveryDate: 'Date de Livraison',
    email: 'Ton Email',
    flavor: 'Goût',
    promoCode: 'Code Promo'
  };

  useEffect(() => {
    if (initialFlavor && formData.flavor === '') {
      setFormData(prevData => ({ ...prevData, flavor: initialFlavor }));
    }
  }, [initialFlavor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const checkPromoCode = async (promoCode) => {
    if (promoCode.trim() === '') {
      setPromoValidation({ valid: null, message: '' });
      return false;
    }

    try {
      const response = await fetch('http://localhost:5001/api/check-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setPromoValidation({ valid: true, message: data.message });
        return true;
      } else {
        setPromoValidation({ valid: false, message: data.message });
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code promo:', error);
      setPromoValidation({ valid: false, message: 'Erreur de vérification' });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    const requiredFields = ['name', 'address', 'deliveryDate', 'email', 'flavor'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      alert(`Veuillez remplir les champs suivants : ${missingFields.join(', ')}`);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Envoi de l'e-mail de notification au propriétaire
        await sendOwnerNotification(formData);
        
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
      const response = await fetch('http://localhost:5001/api/notify-owner', {
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
      // Vous pouvez choisir de gérer l'erreur ici, par exemple en affichant un message à l'utilisateur
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.summaryFieldset}>
            <h3 className={styles.summaryTitle}>COMMANDE</h3>
            <div className={styles.summaryContent}>
              {Object.entries(fieldLabels).map(([field, label]) => (
                field !== 'promoCode' && (
                  <div key={field} className={styles.summaryRow}>
                    <label className={styles.summaryLabel}>{label}</label>
                    <input
                      className={styles.summaryInput}
                      type={field === 'email' ? 'email' : field === 'deliveryDate' ? 'date' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )
              ))}
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.promoCodeField}>
                <label htmlFor="promoCode">{fieldLabels.promoCode}</label>
                <input
                  id="promoCode"
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                />
              </div>
              <button 
                type="submit" 
                className={styles.confirmButton}
              >
                Confirmer mon éco-livraison
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;