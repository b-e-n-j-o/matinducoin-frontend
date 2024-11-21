import { useRouter } from 'next/router';
import BlogArticle from '../../components/BlogArticle';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Article.module.css';
import { fetchArticle } from '../../../pages/api/utils/api'; // Chemin correct

export default function Article({ article, error }) {
  const router = useRouter();

  // Vérifie si le routeur est prêt avant de continuer
  if (!router.isReady) {
    return <div>Chargement...</div>;
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Erreur : {error}</div>
        </main>
      </div>
    );
  }

  // Gestion de l'article non trouvé
  if (!article) {
    return (
      <div className={styles.articleContainer}>
        <Navbar />
        <main>
          <div className={styles.error}>Article non trouvé</div>
        </main>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className={styles.articleContainer}>
      <Navbar />
      <main>
        <BlogArticle article={article} />
      </main>
    </div>
  );
}

// Fonction pour récupérer les données côté serveur
export async function getServerSideProps({ params }) {
  const { id } = params; // Récupère l'ID depuis l'URL dynamique

  try {
    // Utilisation de l'utilitaire fetchArticle pour récupérer l'article
    const article = await fetchArticle(id);

    return {
      props: {
        article, // Passe l'article récupéré au composant
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message || 'Erreur inconnue', // Gestion des erreurs
      },
    };
  }
}
