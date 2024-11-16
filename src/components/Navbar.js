import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import { ShoppingCart, User } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const menuRef = useRef(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (e) => {
    if (!e.target.closest(`.${styles.menuItem}`)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', closeMenu);
      document.body.classList.add('menuOpen');
    } else {
      document.removeEventListener('mousedown', closeMenu);
      document.body.classList.remove('menuOpen');
    }

    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.body.classList.remove('menuOpen');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(itemCount);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Effet pour surveiller les changements de l'état de l'utilisateur
  useEffect(() => {
    console.log("État de l'utilisateur dans Navbar:", user);
  }, [user]);

  const menuItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/produits' },
    { name: 'Articles', path: '/articles' },
    { name: 'Commander', path: '/commander' },
    user ? { name: 'Profil', path: '/profile' } : { name: 'Login', path: '/login' },
  ];

  return (
    <nav className={`${styles.container} w-full h-16 flex justify-between items-center px-4 md:px-8 fixed top-0 z-10 text-white`}>
      <div className={`${styles.fadeInUp} ${styles.brandContainer}`}>
        <Link href="/" passHref legacyBehavior>
          <a className={styles.textEffect}>
            <span className={styles.textContent}>
              <span className={styles.block}>
                {'Matin du coin'.split('').map((letter, i) => (
                  <span key={i} className={styles.letter}>{letter}</span>
                ))}
              </span>
              <span className={styles.block}>
                {'Matin du coin'.split('').map((letter, i) => (
                  <span key={i} className={styles.letter}>{letter}</span>
                ))}
              </span>
            </span>
          </a>
        </Link>
        <div className={styles.logoWrapper}>
          <Image 
            src="/images/cyclist_fond.svg" 
            alt="Logo Matin du coin" 
            width={30} 
            height={30} 
            className={styles.brandLogo} 
          />
        </div>
      </div>
      <div className={`${styles.menuIcon} md:hidden`} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
        <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
        <div className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></div>
      </div>
      <div 
        ref={menuRef} 
        className={`${styles.menuItems} ${isMenuOpen ? styles.open : ''}`}
      >
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path} passHref legacyBehavior>
            <a className={`${styles.textEffect} ${styles.menuItem}`}>
              <span className={styles.textContent}>
                <span className={styles.block}>
                  {item.name.split('').map((letter, i) => (
                    <span key={i} className={styles.letter}>{letter}</span>
                  ))}
                </span>
                <span className={styles.block}>
                  {item.name.split('').map((letter, i) => (
                    <span key={i} className={styles.letter}>{letter}</span>
                  ))}
                </span>
              </span>
            </a>
          </Link>
        ))}
        {user && (
          <span className={`${styles.textEffect} ${styles.menuItem} ${styles.userGreeting}`}>
            Bonjour, {user.username}
          </span>
        )}
        <Link href="/panier" passHref legacyBehavior>
          <a className={`${styles.textEffect} ${styles.menuItem} ${styles.cartIcon}`}>
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className={styles.cartCount}>{cartItemCount}</span>
            )}
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;