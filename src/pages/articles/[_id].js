import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../api/utils/dbConnect.js';
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
  const { _id: id } = params;

  try {
    // Appel à notre propre API plutôt qu'au backend directement
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/articles/${id}`);
    
    if (!response.ok) {
      throw new Error(`Article non trouvé: ${response.status}`);
    }

    const article = await response.json();

    return {
      props: {
        article
      }
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
