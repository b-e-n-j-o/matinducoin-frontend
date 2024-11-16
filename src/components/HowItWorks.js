import React, { useEffect, useRef } from 'react';

const HowItWorks = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const path = pathRef.current;
      const scrollPosition = window.scrollY;
      const section = document.getElementById('how-it-works');
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
        const progress = (scrollPosition - sectionTop) / sectionHeight;
        const pathLength = path.getTotalLength();
        const point = path.getPointAtLength(progress * pathLength);
        // You can do something with the point if needed
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen flex flex-col items-center justify-center text-gray-800 py-12 mb-32 bg-cover bg-center"
      data-aos="fade-up"
    >
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-8">Notre Fonctionnement</h2>
        <p className="text-lg md:text-2xl mb-16">
          Chez Matin du Coin, nous simplifions le processus pour vous offrir des produits frais et éco-responsables en seulement quatre étapes :
        </p>
      </div>
      <svg className="absolute w-full h-full" viewBox="0 0 800 1400" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#FECD5A" strokeWidth="3">
        <path ref={pathRef} d="M 50 400 
                              Q 300 200, 600 500 
                              T 250 1000
                              Q -50 1200, 350 1200 
                              T 750 1350
                              Q 640 1300, -20 1300
                              T 50 400" />
      </svg>
      <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg lg:ml-12" style={{ height: '200px', marginTop: '200px' }}>
          <h3 className="text-xl font-bold mb-4">1. Commande</h3>
          <p>
            Choisissez parmi nos packs de 5 shots de gingembre et sélectionnez votre saveur préférée. Remplissez notre formulaire en ligne avec vos informations personnelles.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-32 lg:mt-12 lg:ml-32" style={{ height: '200px', marginTop: '500px' }}>
          <h3 className="text-xl font-bold mb-4">2. Livraison</h3>
          <p>
            Nous livrons vos produits directement chez vous à vélo, en utilisant des bouteilles en verre réutilisables pour réduire notre impact environnemental.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg lg:ml12 lg:mt-12" style={{ height: '200px', marginTop: '200px' }}>
          <h3 className="text-xl font-bold mb-4">3. Réception</h3>
          <p>
            Recevez vos shots de gingembre dans un contenant gardant la fraîcheur, prêts à être consommés pour votre bien-être quotidien.
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-32 lg:mt-12 lg:ml-32" style={{ height: '200px', marginTop: '500px' }}>
          <h3 className="text-xl font-bold mb-4">4. Retour</h3>
          <p>
            Donnez les consignes pour retourner vos packs de petites bouteilles de gingembre afin qu'elles puissent être récupérées par le livreur et re-remplies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
