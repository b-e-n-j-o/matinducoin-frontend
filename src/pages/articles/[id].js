import React, { useEffect, useState } from 'react';
import { ChevronLeft, Clock, Calendar } from 'lucide-react';
import { useRouter } from 'next/router';

const ProductCard = ({ product }) => {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/produits/${product._id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
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

const BlogArticle = ({ articleId }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [article, setArticle] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Récupération de l'article et des produits associés
  useEffect(() => {
    const fetchArticleAndProducts = async () => {
      try {
        setIsLoading(true);
        
        // Récupération de l'article
        const articleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${articleId}`);
        if (!articleResponse.ok) throw new Error('Failed to fetch article');
        const articleData = await articleResponse.json();
        setArticle(articleData);

        // Récupération des produits associés
        const productPromises = articleData.product_ids.map(productId => 
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`)
            .then(res => res.json())
        );

        const productsData = await Promise.all(productPromises);
        setRelatedProducts(productsData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticleAndProducts();
    }
  }, [articleId]);

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
        <h1 className="text-4xl font-bold text-gray-900">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex items-center gap-6 text-gray-600 text-sm border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>5 min de lecture</span>
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
          {article.content && article.content.map((section, index) => (
            <div key={index}>
              {section.title && <h2 className="text-2xl font-bold text-gray-900 mt-8">{section.title}</h2>}
              {section.content && <p className="text-gray-600 leading-relaxed">{section.content}</p>}
            </div>
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
  );
};

export default BlogArticle;