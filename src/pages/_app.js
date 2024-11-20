import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/tailwind.css';
import '../styles/globals.css';
import '../styles/custom.css';
import homeStyles from '../styles/Home.module.css';  // Important pour le style du chat
import '../styles/Landing.module.css';
import '../styles/Navbar.module.css';
import LoadingIndicator from '../components/LoadingIndicator';
import Chat from '../components/Chat';
import { TransitionProvider, useTransition } from '../context/TransitionContext';
import { UserProvider } from '../context/UserContext';

// Pages où le chat ne devrait pas apparaître
const chatDisabledRoutes = ['/'];

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <TransitionProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </TransitionProvider>
    </UserProvider>
  );
}

const AppContent = ({ Component, pageProps }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { isTransitioning, setIsTransitioning } = useTransition();

  // États du chat exactement comme dans Home
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Fonction toggle exactement comme dans Home
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Effet pour gérer la visibilité exactement comme dans Home
  useEffect(() => {
    if (isChatOpen) {
      setIsChatVisible(true);
    } else {
      const timer = setTimeout(() => setIsChatVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  // Effet pour les transitions de page
  useEffect(() => {
    const handleStart = (url) => {
      if (!(router.pathname === '/' && url === '/home') && url !== '/') {
        setLoading(true);
        setShowLoading(true);
        setIsTransitioning(true);
        // Fermer le chat lors des changements de page
        setIsChatOpen(false);
      }
    };

    const handleComplete = () => {
      setLoading(false);
      setIsTransitioning(false);
      setTimeout(() => setShowLoading(false), 2200);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, setIsTransitioning]);

  // Redirection page d'accueil
  useEffect(() => {
    if (router.pathname === '/') {
      const timeout = setTimeout(() => {
        router.push('/home');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [router]);

  const shouldShowChat = !chatDisabledRoutes.includes(router.pathname) && 
                        !Component.withoutLayout;

  return (
    <>
      {showLoading && (
        <LoadingIndicator 
          onComplete={() => {
            setShowLoading(false);
            setIsTransitioning(false);
          }} 
        />
      )}
      
      <div style={{ paddingTop: !Component.withoutLayout && router.pathname !== '/' ? '10px' : '0' }}>
        <Component {...pageProps} />
      </div>

      {/* Chat exactement comme dans Home */}
      {shouldShowChat && (
  <>
    <button
      onClick={toggleChat}
      className={`
        ${homeStyles.chatButton}
        fixed bottom-5 right-5 p-3 rounded-full shadow-lg
        bg-[#ff5900] text-[#ffd97f]
        hover:bg-[#ffd97f] hover:text-[#ff5900]
        transition-all duration-300
        font-['Bobby_Jones_Soft',_sans-serif]
        ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
    >
      Questions & Commandes!
    </button>
    
    <div
      className={`
        fixed bottom-20 right-5 
        transition-all duration-300 ease-in-out
        ${isChatOpen 
          ? 'transform translate-y-0 opacity-100' 
          : 'transform translate-y-8 opacity-0 pointer-events-none'
        }
      `}
    >
      {isChatVisible && (
        <div className={`
          transition-transform duration-300 ease-in-out
          ${isChatOpen ? 'scale-100' : 'scale-95'}
        `}>
          <Chat
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        </div>
      )}
    </div>
  </>
)}
    </>
  );
};

export default MyApp;