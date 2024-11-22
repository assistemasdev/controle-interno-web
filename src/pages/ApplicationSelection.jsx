
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/sb-admin-2.min.css';
import '../assets/styles/custom-styles.css'; 
import ApplicationCard from '../components/application/ApplicationCard';

const ApplicationSelection = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-pages-blue-light">
      <ApplicationCard>
      </ApplicationCard>
    </div>
  );
};

export default ApplicationSelection;

