import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  
  // Ajoutons ces logs détaillés
  console.log('Router query:', router.query);
  console.log('Router path:', router.asPath);
  console.log('Router is ready:', router.isReady);

  // Si le router n'est pas prêt, montrons un loader
  if (!router.isReady) {
    return <div>Chargement...</div>;
  }

  const { _id } = router.query;
  console.log('ID extrait:', _id);

  // Logs côté client
  console.log('Page Article rendue avec:', {
    articleId: _id,
    articleData: article,
    error,
    query: router.query,
    asPath: router.asPath
  });

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }

  if (error) {
    console.error('Erreur affichée:', error);
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>{error}</div>
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

export async function getServerSideProps({ params, req }) {
  console.log('Params complets:', params);
  const { _id } = params;
  console.log('ID extrait dans getServerSideProps:', _id);

  try {
    const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${_id}`;
    console.log('URL complète de l\'API:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('Headers de la réponse:', response.headers);
    console.log('Status de la réponse:', response.status);

    if (!response.ok) {
      console.log('Réponse non OK, status:', response.status);
      const errorText = await response.text();
      console.log('Contenu de l\'erreur:', errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const article = await response.json();
    console.log('Article récupéré:', article);

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Erreur détaillée:', error);
    return {
      props: {
        error: `Erreur lors de la récupération de l'article: ${error.message}`
      }
    };
  }
}