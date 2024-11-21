import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/tailwind.css';
import '../styles/globals.css';
import '../styles/custom.css';
import homeStyles from '../styles/Home.module.css';
import '../styles/Landing.module.css';
import '../styles/Navbar.module.css';
import LoadingIndicator from '../components/LoadingIndicator';
import Chat from '../components/Chat';
import { TransitionProvider, useTransition } from '../context/TransitionContext';
import { UserProvider } from '../context/UserContext';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection du mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Vérification initiale
    checkMobile();
    
    // Écouteur pour les changements de taille d'écran
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (isChatOpen) {
      setIsChatVisible(true);
      // Empêcher le défilement du body quand le chat est ouvert sur mobile
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      const timer = setTimeout(() => setIsChatVisible(false), 300);
      // Réactiver le défilement
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, isMobile]);

  useEffect(() => {
    const handleStart = (url) => {
      if (!(router.pathname === '/' && url === '/home') && url !== '/') {
        setLoading(true);
        setShowLoading(true);
        setIsTransitioning(true);
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
              z-50
            `}
          >
            Questions & Commandes!
          </button>
          
          <div
            className={`
              fixed bottom-0 right-0 
              transition-all duration-300 ease-in-out
              ${isMobile ? 'w-full h-full' : 'bottom-20 right-5'}
              ${isChatOpen 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform translate-y-8 opacity-0 pointer-events-none'
              }
              z-50
            `}
          >
            {isChatVisible && (
              <div className={`
                transition-transform duration-300 ease-in-out
                ${isChatOpen ? 'scale-100' : 'scale-95'}
                ${isMobile ? 'h-full' : ''}
              `}>
                <Chat
                  isOpen={isChatOpen} 
                  onClose={() => setIsChatOpen(false)}
                  isMobile={isMobile}
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