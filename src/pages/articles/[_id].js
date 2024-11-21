// src/pages/articles/[_id].js
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../api/utils/dbConnect';
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
  const { id } = params;

  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(id)) {
      return { notFound: true };
    }

    const article = await db.collection('articles_divers').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!article) {
      return { notFound: true };
    }

    // Convertir l'ObjectId en string pour la sérialisation
    const serializedArticle = {
      ...article,
      _id: article._id.toString()
    };

    return {
      props: {
        article: serializedArticle
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