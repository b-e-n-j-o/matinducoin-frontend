import { useState } from 'react';
import { useRouter } from 'next/router'; // Utilisation avec Next.js
import styles from '../styles/Register.module.css'; // Import du fichier CSS
import Navbar from '../components/Navbar'; // Import de la barre de navigation

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { username, email, password, confirmPassword } = formData;
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login'); // Rediriger vers la page de connexion après inscription réussie
      } else {
        setErrorMessage(data.msg || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setErrorMessage(`Erreur serveur : ${err.message}`);
    }
  };

  return (
    <>
      <Navbar /> {/* Inclure la barre de navigation en haut de la page */}
      <div className={styles.registerContainer}>
        <h2>Inscription</h2>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Nom d'utilisateur"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirmer le mot de passe"
              required
            />
          </div>
          <button type="submit" className={styles.button}>S'inscrire</button>
        </form>
        <div className={styles.signupLink}>
          <span>Déjà inscrit ? <a href="/login">Connectez-vous ici</a></span>
        </div>
      </div>
    </>
  );
};

export default Register;
