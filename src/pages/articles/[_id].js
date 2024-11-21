import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  const { _id } = router.query;

  console.log('Article component - démarrage', { 
    article, 
    error,
    routerQuery: router.query,
    _id 
  });

  if (!router.isReady) {
    return <div>Chargement...</div>;
  }

  // Erreur spécifique si pas de données
  if (!article && !error) {
    console.error('Données manquantes:', { article, error, _id });
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>
            {`Impossible de charger l'article (ID: ${_id})`}
          </div>
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

export async function getServerSideProps(context) {
  // Log plus détaillé du contexte
  console.log('getServerSideProps context:', {
    params: context.params,
    query: context.query,
    resolvedUrl: context.resolvedUrl
  });

  // S'assurer que nous avons un ID
  const id = context.params._id;
  if (!id) {
    console.error('ID manquant dans les paramètres');
    return {
      props: {
        error: 'ID article manquant'
      }
    };
  }

  // Construction de l'URL avec le bon ID
  const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${id}`;
  console.log('Tentative de fetch vers:', apiUrl);

  try {
    // Tentative avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Log de la réponse
    console.log('Réponse reçue:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', errorText);
      throw new Error(`API a retourné ${response.status}: ${errorText}`);
    }

    const article = await response.json();
    console.log('Article reçu:', article);

    // Validation des données reçues
    if (!article || !article._id) {
      console.error('Article invalide reçu:', article);
      throw new Error('Format d\'article invalide');
    }

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return {
      props: {
        error: `Erreur: ${error.message}`
      }
    };
  }
}