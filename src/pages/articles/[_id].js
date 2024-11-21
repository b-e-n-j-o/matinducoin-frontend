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
  console.log('Params complets:', JSON.stringify(params));
  console.log('URL complète:', req.url);

  if (!params?._id) {
    console.error('ID manquant dans les params');
    return {
      props: {
        error: 'ID article manquant'
      }
    };
  }

  const apiUrl = `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${params._id}`;
  console.log('URL API construite:', apiUrl);

  try {
    console.log('Début appel fetch');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Réponse reçue:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    const data = await response.text(); // D'abord en texte pour voir le contenu brut
    console.log('Données brutes reçues:', data);

    // Essayer de parser en JSON
    let article;
    try {
      article = JSON.parse(data);
      console.log('Données parsées:', {
        id: article._id,
        title: article.title
      });
    } catch (parseError) {
      console.error('Erreur parsing JSON:', parseError);
      throw new Error('Réponse invalide de l\'API');
    }

    // Vérification des données
    if (!article || !article.title) {
      console.error('Article invalide:', article);
      throw new Error('Format d\'article invalide');
    }

    console.log('getServerSideProps terminé avec succès');
    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error('Erreur complète dans getServerSideProps:', error);
    console.error('Stack trace:', error.stack);
    return {
      props: {
        error: `Erreur lors de la récupération: ${error.message}`
      }
    };
  }
}