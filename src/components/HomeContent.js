import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import Chat from './Chat';
import DeliveryZoneMap from './DeliveryZoneMap'; // Importer le composant de la carte
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import homeStyles from '../styles/Home.module.css';
import ClickableImage from '../components/ClickableImage';

gsap.registerPlugin(ScrollTrigger);

const HomeContent = ({ sections = [] }) => {
  const scrollContainerRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const sectionElements = document.querySelectorAll(`.${homeStyles.section}`);
  
    sectionElements.forEach((section, index) => {
      const content = section.querySelector(`.${homeStyles.heroContent}`);
      
      if (content) { // Vérifie que 'content' n'est pas null
        const text = content.querySelector(`.${homeStyles.heroText}`);
        const image = content.querySelector(`.${homeStyles.heroImageContainer}`);
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=-200%",
            end: "bottom top+=5%",
            toggleActions: "play reverse play reverse",
            scrub: 0.5,
          }
        });
  
        tl.fromTo(section, 
          { yPercent: 35, opacity: 0.8 },
          { yPercent: -5, opacity: 1, duration: 0.7, ease: "power3.out" }
        )
        .fromTo(content, 
          { yPercent: 35, opacity: 0.3 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo(text, 
          { yPercent: 10, opacity: 0.3 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(image, 
          { xPercent: index % 2 === 0 ? 10 : -10, opacity: 0.3 },
          { xPercent: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        );
      }
    });
  
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [sections]);
  

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (isChatOpen) {
      setIsChatVisible(true);
    } else {
      const timer = setTimeout(() => setIsChatVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  return (
    <div className={`min-h-screen flex flex-col ${homeStyles.customTextColor}`}>
      <Navbar />
      <main ref={scrollContainerRef} className={homeStyles.mainContent}>
        <section className={`${homeStyles.section} ${homeStyles.heroSection}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h1 className={homeStyles.heroTitle}>
                Matinducoin, vos <em><strong>ginger shots écoresponsables</strong></em>, livrés dans votre quartier !
              </h1>
              <p className={homeStyles.heroSubtitle}>
              Des shots santé faits maison, 100% naturels, livrés à vélo dans des bouteilles réutilisables partout dans votre quartier. Aussi disponibles chez vos commerces locaux engagés. <br />
              Simple, sain, et responsable !
              </p>
            </div>

            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="66f492e440064f42b6213f75"
                src="/images/ginger_herbe.jpg"
                alt="Personne faisant du jogging dans un parc"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section} ${homeStyles.invertedSection}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}>Une <em><strong>dose quotidienne</strong></em> de vitalité</h2>
              <p className={homeStyles.heroSubtitle}>Nos shots de gingembre, <em><strong>préparés avec amour chaque semaine</strong></em>, vous apportent l'énergie dont vous avez besoin pour affronter vos journées avec entrain à la veille de l'hiver!</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="66c6ab3440064f42b6213f6f"
                src="/images/ginger_parc.jpg"
                alt="Shots de gingembre"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}>Pressés à froid, 100%<em><strong>naturels, local et frais</strong></em></h2>
              <p className={homeStyles.heroSubtitle}>Des ingrédients frais <em><strong>pressés à froid,</strong></em>  au jour le jour pour en conserver tous les bienfaits et une fraicheur incomparable.</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="670f814b40064f42b6213f7b"
                src="/images/coldpress.jpeg"
                alt="Ingrédients bio"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section} ${homeStyles.invertedSection}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}><em><strong>Eco-livraison</strong></em> à vélo</h2>
              <p className={homeStyles.heroSubtitle}>2 fois par semaine, nous sillonnons votre quartier à vélo pour vous livrer vos shots. Une <em><strong>approche éco-responsable</strong></em> qui assure fraîcheur des produits et qui renforce les liens dans notre communauté.</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="66c6ab3440064f42b6213f71"
                src="/images/bixi.jpg"
                alt="Livraison à vélo"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}><em><strong>Durable et conscient</strong></em> à chaque gorgée</h2>
              <p className={homeStyles.heroSubtitle}>Nos <em><strong>bouteilles en verre sont réutilisables</strong></em> et consignables dans tous les points de vente, ou récupérées à chaque cycle de livraison, réduisant notre impact environnemental tout en préservant la qualité de nos shots.</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="671089f240064f42b6213f80"
                src="/images/emptybottles.png"
                alt="Bouteilles en verre réutilisables"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section} ${homeStyles.invertedSection}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}>Une semaine d'énergie livrée en <em><strong>une, ou deux fois</strong></em></h2>
              <p className={homeStyles.heroSubtitle}>Recevez vos shots pour toute la semaine en <em><strong> une seule fois</strong></em>  ou en <em><strong> deux livraisons</strong></em> pour amnénager au mieux votre cure tout en profitant d'une fraîcheur
              inégalée.</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="66c6ab3440064f42b6213f71"
                src="/images/6_shots.jpg"
                alt="Livraison hebdomadaire de shots"
              />
            </div>
          </div>
        </section>

        <section className={`${homeStyles.section}`}>
  <div className={homeStyles.heroContent}>
    <div className={homeStyles.heroText}>
      <h2 className={homeStyles.heroTitle}>Le Gingembre pour les Runners : Un Boost Naturel</h2>
      <p className={homeStyles.heroSubtitle}>
        Le gingembre, allié des coureurs, réduit les douleurs musculaires, améliore la récupération et booste l'énergie. Un super-aliment naturel pour optimiser vos performances.
      </p>
    </div>
    <div className={homeStyles.heroImageContainer}>
      <ClickableImage
        _id="6714549f4f6f06c98db78039"
        src="/images/running.jpg"
        alt="Gingembre et coureurs"
      />
    </div>
  </div>
</section>


<section className={`${homeStyles.section} ${homeStyles.invertedSection}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}>Énergie naturelle, <em><strong>sans caféine</strong></em></h2>
              <p className={homeStyles.heroSubtitle}>Nos shots offrent un <em><strong>boost d'énergie 100% naturel</strong></em>, sans les inconvénients de la caféine. Idéal pour une <em><strong>vitalité durable</strong></em> tout au long de la journée.</p>
            </div>
            <div className={homeStyles.heroImageContainer}>
              <ClickableImage
                _id="66c6ab3440064f42b6213f74"
                src="/images/cafeinefree.png"
                alt="Ingrédients naturels énergisants"
              />
            </div>
          </div>
        </section>

                {/* Section pour la carte des zones de livraison */}
                <section className={`${homeStyles.section}`}>
          <div className={homeStyles.mapSectionContent}>
            <h2 className={homeStyles.mapSectionTitle}>Zones de livraison à vélo</h2>
            <p className={homeStyles.mapSectionSubtitle}>Découvrez où nous livrons dans le quartier avec notre service éco-responsable.</p>
            <DeliveryZoneMap /> {/* Ajout de la carte */}
          </div>
        </section>




        <section className={`${homeStyles.section}`}>
          <div className={homeStyles.heroContent}>
            <div className={homeStyles.heroText}>
              <h2 className={homeStyles.heroTitle}>Rejoignez le mouvement santé de votre quartier</h2>
              <p className={homeStyles.heroSubtitle}>Ensemble, créons une communauté dynamique et en pleine forme. Votre bien-être est notre priorité !</p>
              <p className={homeStyles.heroSubtitle}>Inscrivez-vous pour recevoir notre newsletter! :</p>
              <input type="email" placeholder="Votre email" className={homeStyles.emailInput} />
            </div>
          </div>
        </section>
      </main>
      
      <button
        onClick={toggleChat}
        className={`
          ${homeStyles.chatButton}
          fixed bottom-5 right-5 p-3 rounded-full shadow-lg
          bg-[#ff5900] text-[#ffd97f]
          hover:bg-[#ffd97f] hover:text-[#ff5900]
          transition-all duration-300
          ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        Discuter avec notre AI
      </button>
      
      {isChatVisible && (
        <Chat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default HomeContent;
