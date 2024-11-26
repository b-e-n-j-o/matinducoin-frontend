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

  const calculateTotalShots = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateItemPrice = (item) => {
    const totalShots = calculateTotalShots();
    const fullWeekCombos = Math.floor(totalShots / 7);
    const remainingShots = totalShots % 7;
    
    // Calculate what portion of the discount this item should get
    const itemPortion = item.quantity / totalShots;
    let totalPrice = 0;

    if (fullWeekCombos > 0) {
      // Apply discount proportionally to this item
      const discountedShots = fullWeekCombos * 7;
      const itemDiscountedQuantity = Math.min(item.quantity, Math.floor(discountedShots * itemPortion));
      const itemRemainingQuantity = item.quantity - itemDiscountedQuantity;
      
      // Price for discounted portion (5/7 of normal price)
      totalPrice += (itemDiscountedQuantity * item.price * 5/7);
      
      // Price for remaining quantity at full price
      if (itemRemainingQuantity > 0) {
        totalPrice += itemRemainingQuantity * item.price;
      }
    } else {
      totalPrice = item.quantity * item.price;
    }

    return totalPrice;
  };

  const formatItemPrice = (item) => {
    const totalShots = calculateTotalShots();
    const fullWeekCombos = Math.floor(totalShots / 7);
    const itemPortion = item.quantity / totalShots;
    let priceString = '';

    if (fullWeekCombos > 0) {
      const discountedShots = Math.min(item.quantity, Math.floor(fullWeekCombos * 7 * itemPortion));
      const originalPrice = item.quantity * item.price;
      const discountedPrice = calculateItemPrice(item);
      
      priceString += `<span class="${styles.originalPrice}">${originalPrice.toFixed(2)}$ CAD</span> ${discountedPrice.toFixed(2)}$ CAD (Offre spéciale multi-shots)`;
    } else {
      priceString += `${item.quantity} x ${item.price.toFixed(2)}$ CAD`;
    }

    return priceString;
  };

  const total = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);

  const handleCheckout = () => {
    router.push('/commander');
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