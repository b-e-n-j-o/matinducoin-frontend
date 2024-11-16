// src/pages/about.js
import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-gray-800 py-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">À propos de Matin du Coin</h1>
        <section className="max-w-4xl text-lg md:text-2xl mb-8 p-6 bg-white rounded-lg shadow-md">
          <p className="mb-4">
            Chez Matin du Coin, notre mission est de rendre la santé accessible, pratique et écologique. Nous sommes dédiés à la distribution de quartier de produits santé et éco-responsables. Découvrez comment nous fonctionnons pour vous apporter des produits frais et de qualité, tout en respectant notre planète.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">Notre Fonctionnement</h2>
          <p className="mb-4">
            <strong>1. Commande de vos packs de shots de gingembre</strong>
            <br />
            Nous proposons des packs de 5 shots de gingembre pour vous accompagner tout au long de la semaine. Vous avez la possibilité de choisir votre saveur préférée parmi notre sélection de shots de gingembre, chacun étant conçu pour booster votre énergie et soutenir votre bien-être.
          </p>
          <p className="mb-4">
            <strong>2. Passer commande</strong>
            <br />
            Pour passer commande, il vous suffit de remplir notre formulaire en ligne avec vos informations personnelles. Vous indiquerez :
            <ul className="list-disc list-inside ml-4">
              <li>Votre nom</li>
              <li>Votre adresse de livraison</li>
              <li>La date de livraison souhaitée</li>
              <li>Votre adresse e-mail</li>
              <li>Votre choix de saveur de shot de gingembre</li>
            </ul>
          </p>
          <p className="mb-4">
            <strong>3. Livraison éco-responsable</strong>
            <br />
            Nous nous occupons de la livraison de vos produits frais directement chez vous. Nos shots de gingembre sont conditionnés dans des bouteilles en verre réutilisables, pour réduire notre impact environnemental. La livraison se fait à vélo, garantissant une approche respectueuse de l'environnement.
          </p>
          <p className="mb-4">
            <strong>4. Réception de votre commande</strong>
            <br />
            Vos shots de gingembre seront déposés dans un petit contenant gardant la fraîcheur, pour préserver la qualité de nos produits bios. Nous nous assurons que vos produits arrivent en parfait état, prêts à être consommés pour vous offrir une dose quotidienne de bien-être.
          </p>
          <p className="mb-4">
            <strong>5. Engagement écologique</strong>
            <br />
            Chez Matin du Coin, nous sommes fiers de proposer des produits bios et d'adopter des pratiques durables dans toutes nos opérations. En choisissant notre service, vous soutenez une entreprise locale dédiée à la santé de ses clients et à la protection de notre planète.
          </p>
          <p>
            Rejoignez-nous dans cette aventure et découvrez le plaisir de consommer des produits sains et responsables. Matin du Coin – parce que chaque matin mérite de commencer avec énergie et conscience.
          </p>
        </section>
      </main>
      <footer className="py-4 text-center text-white bg-gray-800">
        <p>&copy; 2024 Matin du Coin. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default About;
