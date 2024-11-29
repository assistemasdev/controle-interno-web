import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar'; 
import { useOrgan } from '../hooks/useOrgan';
import { CircularProgress } from '@mui/material';
import { FaBars } from 'react-icons/fa'; // Ícone do menu (hamburger)

const MainLayout = ({ children }) => {
  const { loading } = useOrgan();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Estado para controlar a visibilidade da sidebar

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div id="wrapper" className="d-flex">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Sidebar isVisible={isSidebarVisible} />

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
