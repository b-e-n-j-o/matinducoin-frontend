import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  const router = useRouter();
  console.log('Article page render', {
    id: router.query._id,
    article,
    error
  });

  if (!router.isReady) return <div>Chargement...</div>;

  return (
    <div className={styles.articleContainer}>
      <Navbar />
      <main>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <BlogArticle article={article} />
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { _id } = params;
  console.log('Fetching article:', _id);

  const baseUrl = 'https://matinducoin-backend-b2f47bd8118b.herokuapp.com';
  const fullUrl = `${baseUrl}/api/articles/${_id}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Log pour confirmer la réception des données
    console.log('Successfully fetched article:', {
      title: data.title,
      id: data._id
    });

    return {
      props: {
        article: data
      }
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {
        error: 'Erreur lors de la récupération de l\'article'
      }
    };
  }
}