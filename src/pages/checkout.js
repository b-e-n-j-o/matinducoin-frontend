import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import styles from '../styles/Checkout.module.css';

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    deliveryDate: '',
    email: '',
    promoCode: ''
  });
  const [promoValidation, setPromoValidation] = useState({ valid: null, message: '' });

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);

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
    const requiredFields = ['name', 'address', 'deliveryDate', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Veuillez remplir les champs suivants : ${missingFields.join(', ')}`);
      return;
    }

    const orderData = {
      ...formData,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        localStorage.removeItem('cart');
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
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.summaryFieldset}>
            <h3 className={styles.summaryTitle}>FINALISER LA COMMANDE</h3>
            <div className={styles.summaryContent}>
              {['name', 'address', 'deliveryDate', 'email'].map((field) => (
                <div key={field} className={styles.summaryRow}>
                  <label className={styles.summaryLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    className={styles.summaryInput}
                    type={field === 'email' ? 'email' : field === 'deliveryDate' ? 'date' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
            <div className={styles.cartSummary}>
              <h4>Résumé du panier</h4>
              {cart.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <span>{item.name}</span>
                  <span>{item.quantity} x {item.price}€</span>
                </div>
              ))}
              <div className={styles.totalPrice}>
                Total: {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€
              </div>
            </div>
            <div className={styles.bottomSection}>
              <div className={styles.promoCodeField}>
                <label htmlFor="promoCode">Code Promo</label>
                <input
                  id="promoCode"
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                />
                {promoValidation.message && (
                  <p className={promoValidation.valid ? styles.validPromo : styles.invalidPromo}>
                    {promoValidation.message}
                  </p>
                )}
              </div>
              <button 
                type="submit" 
                className={styles.confirmButton}
              >
                Confirmer la commande
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;