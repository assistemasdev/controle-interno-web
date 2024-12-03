import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import DashboardCard from '../components/dashboard/DashboardCard';
import { faTools, faExchangeAlt, faWrench, faUserPlus } from '@fortawesome/free-solid-svg-icons'; 
import { useLocation } from 'react-router-dom';
import MyAlert from '../components/MyAlert';
const Dashboard = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setErrorMessage(location.state.message);
    }
  }, [location.state]);
  return (
    <MainLayout>
      <div className="container-fluid">
        {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}

        <div className="row">
          <DashboardCard
            title="Equipamentos"
            value="200"
            icon={faTools} 
            color="primary"
          />
          <DashboardCard
            title="Movimentações"
            value="1.200"
            icon={faExchangeAlt} 
            color="warning"
          />
          <DashboardCard
            title="Manutenções"
            value="150"
            icon={faWrench} 
            color="info"
          />
          <DashboardCard
            title="Usuários Cadastrados"
            value="3.500"
            icon={faUserPlus} 
            color="success"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
