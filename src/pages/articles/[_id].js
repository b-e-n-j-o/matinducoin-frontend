import { useRouter } from 'next/router';  // Ajout de l'import manquant
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  
  console.log('Article component - initial props:', { article, error });
  console.log('Router state:', {
    query: router.query,
    path: router.asPath,
    isReady: router.isReady
  });

  // Si le router n'est pas prêt, montrons un loader
  if (!router.isReady) {
    return <div>Chargement...</div>;
  }

  const { _id } = router.query;
  console.log('ID from query:', _id);

  // Si on n'a ni article ni erreur, quelque chose ne va pas
  if (!article && !error) {
    console.error('Ni article ni erreur n\'ont été reçus');
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Une erreur inattendue s'est produite</div>
        </main>
      </div>
    );
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

  // Validation supplémentaire de l'article
  if (!article || typeof article !== 'object') {
    console.error('Article invalide reçu:', article);
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Article invalide</div>
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
  console.log('getServerSideProps - params reçus:', params);

  if (!params?._id) {
    console.error('Pas d\'ID reçu dans les params');
    return {
      props: {
        error: 'ID d\'article manquant'
      }
    };
  }

  try {
    const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${params._id}`;
    console.log('Tentative de fetch:', apiUrl);

    const response = await fetch(apiUrl);
    console.log('Réponse reçue:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', {
        status: response.status,
        text: errorText
      });
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const rawData = await response.json();
    console.log('Données brutes reçues:', JSON.stringify(rawData, null, 2));

    // Validation et transformation des données
    const article = {
      _id: rawData._id || params._id,
      title: rawData.title || '',
      image_banner: rawData.image_banner || '',
      content: Array.isArray(rawData.content) ? rawData.content : [],
      faq: Array.isArray(rawData.faq) ? rawData.faq : [],
      product_ids: Array.isArray(rawData.product_ids) ? rawData.product_ids : []
    };

    console.log('Article transformé:', JSON.stringify(article, null, 2));

    if (!article.title) {
      throw new Error('Article invalide: titre manquant');
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
        error: `Erreur lors de la récupération de l'article: ${error.message}`
      }
    };
  }
}