import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from '../styles/Cart.module.css';
import { UserContext } from '../context/UserContext';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const uniqueCart = cartItems.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc.map(item => 
          item.id === current.id 
            ? { ...item, quantity: item.quantity + current.quantity }
            : item
        );
      }
    }, []);
    setCart(uniqueCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      const updatedCart = cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const calculateItemPrice = (item) => {
    const fullWeekCombos = Math.floor(item.quantity / 7);
    const remainingShots = item.quantity % 7;
    let totalPrice = fullWeekCombos * (item.price * 5);

    if (remainingShots <= 5) {
      totalPrice += remainingShots * item.price;
    } else {
      totalPrice += item.price * 5;
    }

    return totalPrice;
  };

  const formatItemPrice = (item) => {
    const fullWeekCombos = Math.floor(item.quantity / 7);
    const remainingShots = item.quantity % 7;
    let priceString = '';

    if (fullWeekCombos > 0) {
      for (let i = 0; i < fullWeekCombos; i++) {
        const originalPrice = 7 * item.price;
        const discountedPrice = 5 * item.price;
        priceString += `<span class="${styles.originalPrice}">${originalPrice.toFixed(2)}$ CAD</span> ${discountedPrice.toFixed(2)}$ CAD (Offre spéciale semaine)<br>`;
      }
    }

    if (remainingShots > 0) {
      if (priceString) priceString += '<br>';
      if (remainingShots <= 5) {
        priceString += `${remainingShots} x ${item.price.toFixed(2)}$ CAD`;
      } else {
        const originalPrice = remainingShots * item.price;
        priceString += `<span class="${styles.originalPrice}">${originalPrice.toFixed(2)}$ CAD</span> ${(item.price * 5).toFixed(2)}$ CAD (Offre spéciale)`;
      }
    }

    return priceString;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);

  const handleCheckout = () => {
    router.push('/commander'); // Redirige vers la page de commande
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <h1 className={styles.pageTitle}>Ton Panier</h1>
        {cart.length === 0 ? (
          <p className={styles.emptyCartMessage}>Votre panier est vide.</p>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h2 className={styles.itemName}>{item.name}</h2>
                    <p
                      className={styles.itemPrice}
                      dangerouslySetInnerHTML={{ __html: formatItemPrice(item) }}
                    ></p>
                    <p className={styles.itemTotalPrice}>
                      Total: {calculateItemPrice(item).toFixed(2)}$ CAD
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.removeButton}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cartSummary}>
              <p className={styles.totalPrice}>Total: {total.toFixed(2)}$ CAD</p>
              <button className={styles.checkoutButton} onClick={handleCheckout}>
                Continuer vers ma commande
              </button>
            </div>
          </>
        )}
        <Link href="/produits" className={styles.continueShoppingLink}>
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
};

export default CartPage;