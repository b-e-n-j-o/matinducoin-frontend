// src/components/About.js
import React from 'react';

const About = () => {
  return (
    <section id="about" className="min-h-screen flex flex-col items-center justify-center text-center bg-white text-gray-800" data-aos="fade-up">
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl md:text-5xl font-bold">À propos de nous</h2>
        <p className="mt-4 text-lg md:text-2xl">
          Bienvenue chez Matin du Coin, votre partenaire local pour des produits santé et éco-responsables. 
          Nous sommes passionnés par la distribution de produits frais et naturels, conçus pour dynamiser 
          votre journée tout en respectant notre planète.
        </p>

        <h3 className="text-2xl md:text-4xl font-bold mt-12 mb-4" data-aos="fade-up" data-aos-delay="100">Notre Fonctionnement</h3>

        <div className="my-8" data-aos="fade-up" data-aos-delay="200">
          <h4 className="text-xl md:text-3xl font-bold">1. Commande de vos packs de shots de gingembre</h4>
          <p className="mt-2 text-lg md:text-xl">
            Nous proposons des packs de 5 shots de gingembre pour vous accompagner tout au long de la semaine. Vous avez la possibilité de choisir votre saveur préférée parmi notre sélection de shots de gingembre, chacun étant conçu pour booster votre énergie et soutenir votre bien-être.
          </p>
        </div>

        <div className="my-8" data-aos="fade-up" data-aos-delay="300">
          <h4 className="text-xl md:text-3xl font-bold">2. Passer commande</h4>
          <p className="mt-2 text-lg md:text-xl">
            Pour passer commande, il vous suffit de remplir notre formulaire en ligne avec vos informations personnelles. Vous indiquerez :
            <ul className="list-disc list-inside ml-4">
              <li>Votre nom</li>
              <li>Votre adresse de livraison</li>
              <li>La date de livraison souhaitée</li>
              <li>Votre adresse e-mail</li>
              <li>Votre choix de saveur de shot de gingembre</li>
            </ul>
          </p>
        </div>

        <div className="my-8" data-aos="fade-up" data-aos-delay="400">
          <h4 className="text-xl md:text-3xl font-bold">3. Livraison éco-responsable</h4>
          <p className="mt-2 text-lg md:text-xl">
            Nous nous occupons de la livraison de vos produits frais directement chez vous. Nos shots de gingembre sont conditionnés dans des bouteilles en verre réutilisables, pour réduire notre impact environnemental. La livraison se fait à vélo, garantissant une approche respectueuse de l'environnement.
          </p>
        </div>

        <div className="my-8" data-aos="fade-up" data-aos-delay="500">
          <h4 className="text-xl md:text-3xl font-bold">4. Réception de votre commande</h4>
          <p className="mt-2 text-lg md:text-xl">
            Vos shots de gingembre seront déposés dans un petit contenant gardant la fraîcheur, pour préserver la qualité de nos produits bios. Nous nous assurons que vos produits arrivent en parfait état, prêts à être consommés pour vous offrir une dose quotidienne de bien-être.
          </p>
        </div>

        <div className="my-8" data-aos="fade-up" data-aos-delay="600">
          <h4 className="text-xl md:text-3xl font-bold">5. Engagement écologique</h4>
          <p className="mt-2 text-lg md:text-xl">
            Chez Matin du Coin, nous sommes fiers de proposer des produits bios et d'adopter des pratiques durables dans toutes nos opérations. En choisissant notre service, vous soutenez une entreprise locale dédiée à la santé de ses clients et à la protection de notre planète.
          </p>
        </div>

        <p className="mt-8 text-lg md:text-xl" data-aos="fade-up" data-aos-delay="700">
          Rejoignez-nous dans cette aventure et découvrez le plaisir de consommer des produits sains et responsables. Matin du Coin – parce que chaque matin mérite de commencer avec énergie et conscience.
        </p>
      </div>
    </section>
  );
};

export default About;
