import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import DashboardCard from '../components/dashboard/DashboardCard';
import { faTools, faExchangeAlt, faWrench, faUserPlus } from '@fortawesome/free-solid-svg-icons'; 

const Dashboard = () => {

  return (
    <MainLayout selectedCompany="ALUCOM">
      <div className="container-fluid">
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
