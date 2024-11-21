import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  const { _id } = router.query;

  // Logs détaillés
  console.log('=== Rendu de la page Article ===');
  console.log('ID dans l\'URL:', _id);
  console.log('État du router:', {
    isReady: router.isReady,
    query: router.query,
    path: router.asPath
  });
  console.log('Props reçues:', { article, error });

  if (!router.isReady) {
    console.log('Router pas encore prêt');
    return <div>Chargement...</div>;
  }

  if (error) {
    console.error('Erreur reçue:', error);
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
    console.error('Pas d\'article reçu');
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Article non trouvé</div>
        </main>
      </div>
    );
  }

  console.log('Article trouvé, rendu du composant BlogArticle');
  return (
    <div className={styles.articleContainer}>
      <Navbar />
      <main>
        <BlogArticle article={article} />
      </main>
    </div>
  );
}

export async function getServerSideProps({ params, req }) {
  console.log('=== getServerSideProps démarré ===');
  console.log('Params reçus:', params);
  console.log('URL demandée:', req.url);

  const { _id } = params;

  try {
    const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${_id}`;
    console.log('Appel API vers:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('Status réponse:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur ${response.status}`);
    }

    const article = await response.json();
    console.log('Article récupéré:', {
      id: article._id,
      title: article.title
    });

    // Vérification des données
    if (!article || !article.title) {
      throw new Error('Format d\'article invalide');
    }

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Erreur complète:', error);
    return {
      props: {
        error: `Erreur: ${error.message}`
      }
    };
  }
}