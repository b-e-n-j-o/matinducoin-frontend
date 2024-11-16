import React from 'react';
import '../styles/Footer.module.css'; // Tu peux aussi l'inclure directement avec des styles en ligne si tu préfères

const Footer = () => {
    return (
        <footer className="footer">
            <div className="contact-info">
                Contactez-nous : <a href="mailto:matinducoin@gmail.com">matinducoin@gmail.com</a>
            </div>
            <div className="message">
                Des produits sains pour les gens du coin
            </div>
        </footer>
    );
};

export default Footer;
