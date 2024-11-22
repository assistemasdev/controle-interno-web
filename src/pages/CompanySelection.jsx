
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import OrganCard from '../components/organ/OrganCard';

const CompanySelection = () => {
  return (
    <div className="d-flex bg-pages-blue-light align-items-center justify-content-center vh-100">
      <OrganCard>
      </OrganCard>
    </div>
  );
};

export default CompanySelection;

