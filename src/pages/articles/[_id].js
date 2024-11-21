import { ObjectId } from 'mongodb';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  if (error) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Une erreur s'est produite : {error}</div>
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
    // Utiliser votre API backend au lieu de connectToDatabase
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${_id}`
    );

    if (!response.ok) {
      throw new Error('Article non trouvé');
    }

    const article = await response.json();

    if (!article) {
      return { notFound: true };
    }

    return {
      props: {
        article
      },
    };
  } catch (error) {
    console.error('Erreur:', error);
    return { 
      props: { 
        error: `Une erreur s'est produite : ${error.message}` 
      } 
    };
  }
}