// frontend/src/pages/articles/[id].js
import BlogArticle from '../../components/BlogArticle';  // Chemin relatif
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  // Rediriger vers la page 404 si pas d'ID après le chargement initial
  useEffect(() => {
    if (router.isReady && !id) {
      router.push('/404');
    } else if (router.isReady) {
      setIsLoading(false);
    }
  }, [router.isReady, id]);

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Article | Matin du Coin</title>
        <meta name="description" content="Découvrez cet article sur Matin du Coin" />
      </Head>

      <main className="min-h-screen py-8">
        {id && <BlogArticle articleId={id} />}
      </main>
    </>
  );
}