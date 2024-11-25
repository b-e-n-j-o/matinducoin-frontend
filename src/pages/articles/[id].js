// frontend/src/pages/articles/[id].js
import BlogArticle from '../../components/BlogArticle';  // Chemin relatif
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Fade in effect on scroll
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // Rediriger vers la page 404 si pas d'ID après le chargement initial
    if (router.isReady && !id) {
      router.push('/404');
    } else if (router.isReady) {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [router.isReady, id]);

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <Navbar />
      <Head>
        <title>Article | Matin du Coin</title>
        <meta name="description" content="Découvrez cet article sur Matin du Coin" />
      </Head>

      <main className="min-h-screen py-8">
        {id && <div className="fade-in-section"><BlogArticle articleId={id} /></div>}
      </main>
    </>
  );
}