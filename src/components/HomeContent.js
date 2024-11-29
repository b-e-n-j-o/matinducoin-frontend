import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Chat from './Chat';
import DeliveryZoneMap from './DeliveryZoneMap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import homeStyles from '../styles/Home.module.css';
import ClickableImage from '../components/ClickableImage';
import NewsletterSection from '../components/NewsletterSection';


gsap.registerPlugin(ScrollTrigger);

const HomeContent = ({ sections = [] }) => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const sectionElements = document.querySelectorAll(`.${homeStyles.section}`);
    const isMobile = window.innerWidth < 768;
  
    sectionElements.forEach((section, index) => {
      const content = section.querySelector(`.${homeStyles.heroContent}`);
      
      if (content) {
        const text = content.querySelector(`.${homeStyles.heroText}`);
        const image = content.querySelector(`.${homeStyles.heroImageContainer}`);
        
        // Animation fluide au survol avec courbe de Bézier uniquement pour le texte
        if (text) {
          text.addEventListener('mouseenter', () => {
            gsap.to(text, {
              scale: 1.03,
              duration: 0.4,
              ease: "cubic-bezier(0.4, 0, 0.2, 1)"
            });
          });

          text.addEventListener('mouseleave', () => {
            gsap.to(text, {
              scale: 1,
              duration: 0.4,
              ease: "cubic-bezier(0.4, 0, 0.2, 1)" 
            });
          });
        }

        if (isMobile) {
          const tlMobile = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              toggleActions: "play reverse play reverse", 
              scrub: {
                duration: 0.3,
                ease: "power2.inOut"
              }
            }
          });

          tlMobile.fromTo(text, 
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            }
          );

          if (image) {
            tlMobile.fromTo(image,
              {
                y: 30,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
              },
              "-=0.6"
            );
          }
        } else {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "restart pause reverse pause",
              scrub: {
                duration: 1,
                ease: "power2.inOut"
              }
            }
          });

          if (index % 2 === 0) {
            tl.fromTo(text,
              { x: -200, opacity: 0 },
              { x: 0, opacity: 1, duration: 2, ease: "power2.out" }
            );
            if (image) {
              tl.fromTo(image,
                { x: 200, opacity: 0 },
                { x: 0, opacity: 1, duration: 2, ease: "power2.out" },
                "-=2"
              );
            }
          } else {
            tl.fromTo(text,
              { x: 200, opacity: 0 },
              { x: 0, opacity: 1, duration: 2, ease: "power2.out" }
            );
            if (image) {
              tl.fromTo(image,
                { x: -200, opacity: 0 },
                { x: 0, opacity: 1, duration: 2, ease: "power2.out" },
                "-=2"
              );
            }
          }
        }
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

  const handleClick = (id) => {
    router.push(`/articles/${id}`);
  };

  const HeroSection = ({ id, title, subtitle, imageSrc, imageAlt, isInverted = false }) => {
    return (
      <section className={`${homeStyles.section} ${isInverted ? homeStyles.invertedSection : ''} w-[95vw] mx-auto`}>
        <div className={`${homeStyles.heroContent} w-full`}>
          <div 
            className={`${homeStyles.heroText} w-full bg-white/40 rounded-xl p-6 pb-12 shadow-lg cursor-pointer relative hover:shadow-xl transition-shadow duration-300`}
            onClick={() => handleClick(id)}
          >
            <div className="h-full flex flex-col">
              {title}
              {subtitle}
              <span className="see-more text-center mt-8 text-sm text-gray-500 italic hover:scale-110 hover:text-[#ff5900] transition-all duration-300">
                voir plus
              </span>
            </div>
          </div>
          <div className={`${homeStyles.heroImageContainer} w-full`}>
            <div onClick={() => handleClick(id)} className="cursor-pointer w-full">
              <ClickableImage
                _id={id}
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${homeStyles.customTextColor}`}>
      <Navbar />
      <main ref={scrollContainerRef} className={`${homeStyles.mainContent} w-full`}>
        <HeroSection
          id="66f492e440064f42b6213f75"
          title={
            <h1 className={homeStyles.heroTitle}>
              Matinducoin, vos <em><strong>ginger shots écoresponsables</strong></em>, livrés dans votre quartier !
            </h1>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Des shots santé faits maison, 100% naturels, livrés à vélo dans des bouteilles réutilisables partout dans votre quartier. Aussi disponibles chez vos commerces locaux engagés. <br />
              Simple, sain, et responsable !
            </p>
          }
          imageSrc="/images/ginger_herbe.jpg"
          imageAlt="Personne faisant du jogging dans un parc"
        />

        <HeroSection
          id="67144ab64f6f06c98db78037"
          title={
            <h2 className={homeStyles.heroTitle}>
              Une <em><strong>dose quotidienne</strong></em> de vitalité
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Nos shots de gingembre, <em><strong>préparés avec amour chaque semaine</strong></em>, vous apportent l'énergie dont vous avez besoin pour affronter vos journées avec entrain à la veille de l'hiver!
            </p>
          }
          imageSrc="/images/ginger_parc.jpg"
          imageAlt="Shots de gingembre"
          isInverted={true}
        />

        <HeroSection
          id="670f814b40064f42b6213f7b"
          title={
            <h2 className={homeStyles.heroTitle}>
              Pressés à froid, 100%<em><strong>naturels, local et frais</strong></em>
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Des ingrédients frais <em><strong>pressés à froid,</strong></em> au jour le jour pour en conserver tous les bienfaits et une fraicheur incomparable.
            </p>
          }
          imageSrc="/images/coldpress.jpeg"
          imageAlt="Ingrédients bio"
        />

        <HeroSection
          id="66c6ab3440064f42b6213f71"
          title={
            <h2 className={homeStyles.heroTitle}>
              <em><strong>Eco-livraison</strong></em> à vélo
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              2 fois par semaine, nous sillonnons votre quartier à vélo pour vous livrer vos shots. Une <em><strong>approche éco-responsable</strong></em> qui assure fraîcheur des produits et qui renforce les liens dans notre communauté.
            </p>
          }
          imageSrc="/images/bixi.jpg"
          imageAlt="Livraison à vélo"
          isInverted={true}
        />

        <HeroSection
          id="671089f240064f42b6213f80"
          title={
            <h2 className={homeStyles.heroTitle}>
              <em><strong>Durable et conscient</strong></em> à chaque gorgée
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Nos <em><strong>bouteilles en verre sont réutilisables</strong></em> et consignables dans tous les points de vente, ou récupérées à chaque cycle de livraison, réduisant notre impact environnemental tout en préservant la qualité de nos shots.
            </p>
          }
          imageSrc="/images/emptybottles.png"
          imageAlt="Bouteilles en verre réutilisables"
        />

        <HeroSection
          id="671a49924f6f06c98db7803a"
          title={
            <h2 className={homeStyles.heroTitle}>
              Une semaine d'énergie livrée en <em><strong>une, ou deux fois</strong></em>
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Recevez vos shots pour toute la semaine en <em><strong>une seule fois</strong></em> ou en <em><strong>deux livraisons</strong></em> pour amnénager au mieux votre cure tout en profitant d'une fraîcheur inégalée.
            </p>
          }
          imageSrc="/images/6_shots.jpg"
          imageAlt="Livraison hebdomadaire de shots"
          isInverted={true}
        />

        <HeroSection
          id="6714549f4f6f06c98db78039"
          title={
            <h2 className={homeStyles.heroTitle}>
              Le Gingembre pour les Runners : Un Boost Naturel
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Le gingembre, allié des coureurs, réduit les douleurs musculaires, améliore la récupération et booste l'énergie. Un super-aliment naturel pour optimiser vos performances.
            </p>
          }
          imageSrc="/images/running.jpg"
          imageAlt="Gingembre et coureurs"
        />

        <HeroSection
          id="66f492e440064f42b6213f75"
          title={
            <h2 className={homeStyles.heroTitle}>
              Énergie naturelle, <em><strong>sans caféine</strong></em>
            </h2>
          }
          subtitle={
            <p className={homeStyles.heroSubtitle}>
              Nos shots offrent un <em><strong>boost d'énergie 100% naturel</strong></em>, sans les inconvénients de la caféine. Idéal pour une <em><strong>vitalité durable</strong></em> tout au long de la journée.
            </p>
          }
          imageSrc="/images/cafeinefree.png"
          imageAlt="Ingrédients naturels énergisants"
          isInverted={true}
        />

        <section className={`${homeStyles.section} w-[95vw] mx-auto`}>
          <div className={`${homeStyles.mapSectionContent} w-full bg-white/40 rounded-xl p-6 shadow-lg`}>
            <h2 className={`${homeStyles.mapSectionTitle} text-center`}>Zones de livraison à vélo</h2>
            <p className={homeStyles.mapSectionSubtitle}>Découvrez où nous livrons dans le quartier avec notre service éco-responsable.</p>
            <DeliveryZoneMap />
          </div>
        </section>
      </main>

      <footer className="bg-white/40 py-8 mt-12 rounded-xl shadow-lg w-[95vw] mx-auto">
        <div className="w-full mx-auto text-center">
          <p className="text-gray-600">© 2024 Matin du Coin. Tous droits réservés.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-orange-500 hover:text-orange-600">Mentions légales</a>
            <a href="#" className="text-orange-500 hover:text-orange-600">Contact</a>
          </div>
        </div>
      </footer>

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
