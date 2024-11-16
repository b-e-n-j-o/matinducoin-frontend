import React from 'react';
import { useAuthUser } from 'react-auth-kit';

const Dashboard = () => {
  const auth = useAuthUser();
  return <h1>Bienvenue, {auth()?.email}</h1>;
};

export default Dashboard;
