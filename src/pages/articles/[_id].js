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
    const response = await fetch(
      `https://matinducoin-backend-b2f47bd8118b.herokuapp.com/api/articles/${_id}`
    );

    if (!response.ok) {
      throw new Error('Article non trouvé');
    }

    const article = await response.json();

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