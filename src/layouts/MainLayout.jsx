import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import '../assets/styles/layouts/MainLayout.css';

const MainLayout = ({ children, selectedCompany }) => {
  return (
    <div className="main-layout">
      <Sidebar selectedCompany={selectedCompany} />
      <div className="main-content">
        <Topbar selectedCompany={selectedCompany} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
