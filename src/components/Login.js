import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/panier');
      } else {
        setErrorMessage(data.msg || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setErrorMessage(`Erreur serveur : ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.loginContainer}>
        <h2>Connexion</h2>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              required
              className={styles.inputField}
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
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.button}>Se connecter</button>
        </form>
        <div className={styles.signupLink}>
          <span>Pas encore inscrit ? <a href="/register">Inscrivez-vous ici</a></span>
        </div>
      </div>
    </>
  );
};

export default Login;
