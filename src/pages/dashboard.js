// src/pages/dashboard.js
import dynamic from 'next/dynamic'

// Créer le composant avec le hook d'auth
const DashboardComponent = () => {
  const auth = useAuthUser();
  return <h1>Bienvenue, {auth()?.email}</h1>;
};

// Empêcher le SSR pour ce composant
const DashboardWithNoSSR = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false
});

// Page principale qui utilise le composant non-SSR
function Dashboard() {
  return <DashboardWithNoSSR />;
}

export default Dashboard;