// frontend/src/pages/articles/[id].js
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ChevronLeft, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';

const ProductCard = ({ product }) => {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/produits/${product._id}`)}
      className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="relative h-48">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
        <p className="text-orange-500 font-medium mt-2">{product.price.toFixed(2)}€</p>
      </div>
    </div>
  );
};

const ContentBlock = ({ block }) => {
  switch (block.type) {
    case "header":
      const HeaderTag = `h${block.level || 1}`;
      return (
        <HeaderTag className={`font-bold text-gray-900 ${
          block.level === 1 ? 'text-4xl mb-6' : 
          block.level === 2 ? 'text-2xl mt-12 mb-4' : 
          'text-xl mt-8 mb-3'
        }`}>
          {block.data}
        </HeaderTag>
      );
    
    case "text":
      return (block.data?.content || []).map((contentItem, index) => {
        switch (contentItem.type) {
          case "paragraph":
            return (
              <div 
                key={index} 
                className="mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                {contentItem.sentences.map((sentence, sentenceIndex) => {
                  // Diviser la phrase en segments basés sur les marqueurs **
                  const segments = sentence.split(/(\*\*.*?\*\*)/g);
                  
                  return (
                    <p key={sentenceIndex} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
                      {segments.map((segment, segmentIndex) => {
                        // Vérifier si le segment est entouré de **
                        if (segment.startsWith('**') && segment.endsWith('**')) {
                          // Enlever les ** et mettre en gras
                          return <strong key={segmentIndex}>{segment.slice(2, -2)}</strong>;
                        }
                        // Retourner le texte normal
                        return <span key={segmentIndex}>{segment}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            );
          default:
            return null;
        }
      });
    
    default:
      return null;
  }
};

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [article, setArticle] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestion du chargement initial et redirection
  useEffect(() => {
    if (router.isReady && !id) {
      router.push('/404');
    }
  }, [router.isReady, id]);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !router.isReady) return;

      try {
        // Récupération de l'article
        const articleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
        if (!articleResponse.ok) throw new Error('Failed to fetch article');
        const articleData = await articleResponse.json();
        setArticle(articleData);

        // Récupération des produits associés
        if (articleData.product_ids?.length) {
          const productPromises = articleData.product_ids.map(productId => 
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`)
              .then(res => res.json())
          );
          const productsData = await Promise.all(productPromises);
          setRelatedProducts(productsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router.isReady]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement de l'article.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Article non trouvé</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Head>
        <title>{article.title} | Matin du Coin</title>
        <meta name="description" content={article.content?.[1]?.data?.content?.[0]?.sentences?.[0] || "Découvrez cet article sur Matin du Coin"} />
      </Head>

      <main className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 pb-16">
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div 
              className="h-full bg-orange-500 transition-all duration-200"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-8 group"
          >
            <ChevronLeft className="transition-transform group-hover:-translate-x-1" />
            Retour aux articles
          </button>

          {/* Article Content */}
          <div className={`space-y-6 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Title will be handled by ContentBlock now */}

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-gray-600 text-sm border-b border-gray-200 pb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Feature Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <img 
                src={article.image_banner}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none mt-8 space-y-6">
              {article.content && article.content.map((block, index) => (
                <ContentBlock key={index} block={block} />
              ))}
            </article>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits mentionnés dans cet article</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}