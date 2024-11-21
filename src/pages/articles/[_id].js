import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  const { _id } = router.query;

  console.log('Article page render', {
    id: _id,
    articleReceived: !!article,
    articleContent: article,
    error
  });

  if (!router.isReady) {
    console.log('Router not ready');
    return <div>Chargement...</div>;
  }

  if (error) {
    console.error('Error received:', error);
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
    console.error('No article received for ID:', _id);
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Article non trouvé</div>
        </main>
      </div>
    );
  }

  console.log('Rendering article:', {
    id: article._id,
    title: article.title
  });

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
  console.log('getServerSideProps starting with params:', params);

  const { _id } = params;

  try {
    // Construction de l'URL
    const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${_id}`;
    console.log('Fetching from:', apiUrl);

    // Appel à l'API
    const response = await fetch(apiUrl);
    console.log('Response status:', response.status);

    // Vérification de la réponse
    if (!response.ok) {
      const text = await response.text();
      console.error('API error:', {
        status: response.status,
        text: text
      });
      throw new Error(`Erreur ${response.status}: ${text}`);
    }

    // Récupération des données
    const data = await response.json();
    console.log('Article data received:', {
      id: data._id,
      title: data.title,
      hasContent: !!data.content
    });

    // Vérification des données
    if (!data || !data._id || !data.title) {
      console.error('Invalid article data:', data);
      throw new Error('Article invalide');
    }

    // Retour des données
    return {
      props: {
        article: data
      }
    };
  } catch (error) {
    console.error('Full error:', error);
    return {
      props: {
        error: error.message || 'Erreur inconnue'
      }
    };
  }
}