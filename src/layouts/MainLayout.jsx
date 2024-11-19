import React from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar'; 
import { useCompany } from '../hooks/useCompany';
import { CircularProgress } from '@mui/material';

const MainLayout = ({ children }) => {
  const { loading } = useCompany();

  return (
    <div id="wrapper" className="d-flex">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column w-100">
            <div id="content" className="flex-grow-1">
              <Topbar />
              <div className="container-fluid">
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout;
