import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();

  // Debug logs
  console.log('Page Article rendue:', {
    article, 
    error,
    query: router.query
  });

  if (!router.isReady) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>{error}</div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Article non trouvé</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.articleContainer}>
      <Navbar />
      <main>
        <BlogArticle article={article} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { _id } = params;
  
  try {
    // Appel direct à l'API backend
    const response = await fetch(
      `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${_id}`
    );

    // Log pour debug
    console.log(`Fetching article ${_id}, status:`, response.status);

    // Si la réponse n'est pas ok, récupérer le message d'erreur
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération de l\'article');
    }

    // Récupérer l'article
    const article = await response.json();
    console.log('Article récupéré:', article.title);

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return {
      props: {
        error: error.message
      }
    };
  }
}