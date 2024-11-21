import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';

export default function Article({ article, error }) {
  console.log("Article reçu dans la page :", article); // Debug

  if (error) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Erreur: {error}</div>
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
  console.log("ID reçu:", _id); // Debug

  const backendUrl = 'https://matinducoin-backend-b2f47bd8118b.herokuapp.com';
  const articleUrl = `${backendUrl}/api/articles/${_id}`;
  
  console.log("URL appelée:", articleUrl); // Debug

  try {
    const response = await fetch(articleUrl);
    console.log("Status de la réponse:", response.status); // Debug

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const article = await response.json();
    console.log("Données reçues:", article); // Debug

    return {
      props: {
        article
      }
    };
  } catch (error) {
    console.error("Erreur complète:", error);
    return {
      props: {
        error: error.message
      }
    };
  }
}