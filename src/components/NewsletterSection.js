// components/NewsletterSection.js
import React, { useState } from 'react';

const NewsletterSection = ({ styles }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/mailinglist/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Merci pour votre inscription !');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur de connexion au serveur');
    }
  };

  return (
    <section className={`${styles.section}`}>
      <div className={`${styles.heroContent} w-11/12 mx-auto`}>
        <div className={`${styles.heroText} w-full bg-white/40 rounded-xl p-6 shadow-lg`}>
          <h2 className="text-[#FF5900] text-center text-3xl font-bold mb-4">
            REJOIGNEZ LE MOUVEMENT SANTÉ DE VOTRE QUARTIER
          </h2>
          <p className="text-[#FF5900] text-center text-xl mb-4">
            ENSEMBLE, CRÉONS UNE COMMUNAUTÉ DYNAMIQUE ET EN PLEINE FORME. VOTRE BIEN-ÊTRE EST NOTRE PRIORITÉ !
          </p>
          <p className="text-[#FF5900] text-center text-xl mb-4">
            INSCRIVEZ-VOUS POUR RECEVOIR NOTRE NEWSLETTER! :
          </p>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="email"
                placeholder="VOTRE EMAIL"
                className="flex-1 px-4 py-2 border rounded-lg text-gray-600 placeholder-gray-400 focus:outline-none focus:border-[#FF5900]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg transition-colors ${
                  status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#FF5900] hover:bg-[#ff7900] text-white'
                }`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'En cours...' : 'S\'inscrire'}
              </button>
            </div>
            
            {message && (
              <div className={`mt-3 p-3 rounded text-center ${
                status === 'success' 
                  ? 'text-[#FF5900]' 
                  : 'text-red-600'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;