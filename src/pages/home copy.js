import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
import 'tailwindcss/tailwind.css';
import homeStyles from '../styles/Home.module.css';

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      setIsChatVisible(true);
    } else {
      const timer = setTimeout(() => setIsChatVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (isMounted) {
      const elements = document.querySelectorAll(`.${homeStyles.fadeInUp}`);
      elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add(homeStyles.animated);
      });
    }
  }, [isMounted]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollFraction = scrollPosition / totalHeight;
      const backgroundPosition = scrollFraction * 100;

      const gradientScroll = document.querySelector(`.${homeStyles.gradientScroll}`);
      if (gradientScroll) {
        gradientScroll.style.backgroundPosition = `0% ${backgroundPosition}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${homeStyles.customTextColor} ${homeStyles.gradientScroll}`}>
      <Navbar />
      <main className={homeStyles.mainContent}>
        <section className={`${homeStyles.section} ${homeStyles.fadeInUp}`}>
          <h1 className={`${homeStyles.title} ${homeStyles.titleLarge}`}>Looking for a Morning Boost?</h1>
        </section>
        <section className={`${homeStyles.section} ${homeStyles.fadeInUp}`}>
          <h2 className={homeStyles.title}>Ginger Shots for the Whole Week</h2>
        </section>
        <section className={`${homeStyles.section} ${homeStyles.fadeInUp}`}>
          <h2 className={homeStyles.title}>100% Fresh and Organic</h2>
        </section>
        <section className={`${homeStyles.section} ${homeStyles.fadeInUp}`}>
          <h2 className={homeStyles.title}>Eco-Chic Weekly Bike Delivery</h2>
        </section>
        <section className={`${homeStyles.section} ${homeStyles.fadeInUp}`}>
          <h2 className={homeStyles.title}>Join Your Local Health Movement</h2>
          <p className={homeStyles.subtitle}>Please enter your email to sign up for the queue</p>
          <input type="email" placeholder="Your email" className={homeStyles.emailInput} />
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
        Chat with AI
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

export default Home;