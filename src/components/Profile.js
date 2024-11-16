import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { setUser: setContextUser } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Token manquant');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Erreur lors de la récupération du profil');
        }

        const data = await res.json();
        setUser(data);
        setContextUser(data); // Mise à jour du contexte utilisateur
      } catch (err) {
        setErrorMessage(err.message);
        // En cas d'erreur, on considère que l'utilisateur n'est pas connecté
        setContextUser(null);
        localStorage.removeItem('token');
      }
    };

    fetchProfile();
  }, [setContextUser]);

  const calculateProgress = (bottlesReturned) => {
    const progress = (bottlesReturned / 10) * 100;
    return progress > 0 ? progress : 10;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la déconnexion');
      }

      localStorage.removeItem('token');
      setUser(null);
      setContextUser(null); // Mise à jour du contexte utilisateur
      router.push('/login');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleViewProducts = () => {
    router.push('/produits');
  };


  const handleViewCart = () => {
    router.push('/panier');
  };


  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        {user && (
          <h2 className={styles.greeting}>
            Bon matin, <span className={styles.username}>{user.username}</span> !
          </h2>
        )}
        {user ? (
          <div>
            <div className={styles.profileInfo}>
              <label>Nom d'utilisateur:</label>
              <p>{user.username}</p>
            </div>
            <div className={styles.profileInfo}>
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.profileInfo}>
              <label>Bouteilles retournées:</label>
              <div className={styles.progressBox}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${calculateProgress(user.bottlesReturned)}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{user.bottlesReturned}/10</span>
              </div>
              {user.bottlesReturned >= 10 && (
                <p className={styles.rewardMessage}>Félicitations ! Vous avez droit à un shot gratuit !</p>
              )}
            </div>
            <button className={styles.viewCartButton} onClick={handleViewCart}>Voir le panier</button>
            <button className={styles.viewProductsButton} onClick={handleViewProducts}>Voir les produits</button>
            <button className={styles.logoutButton} onClick={handleLogout}>Se déconnecter</button>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </>
  );
};

export default Profile;