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
  const { id } = params; // Changé de _id à id pour correspondre au paramètre de route Next.js

  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(id)) {
      return { notFound: true };
    }

    const article = await db.collection('articles_divers').findOne({ _id: new ObjectId(id) });

    if (!article) {
      return { notFound: true };
    }

    return {
      props: {
        article: JSON.parse(JSON.stringify(article)),
      },
    };
  } catch (error) {
    return { 
      props: { 
        error: `Une erreur s'est produite : ${error.message}` 
      } 
    };
  }
}