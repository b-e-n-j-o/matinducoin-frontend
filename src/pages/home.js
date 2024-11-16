import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

const DynamicHomeContent = dynamic(() => import('../components/HomeContent'), {
  ssr: false,
  loading: () => <p>Chargement...</p>
});

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <DynamicHomeContent />;
};

export default Home;