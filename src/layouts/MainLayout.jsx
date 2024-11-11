import React from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar'; 

const MainLayout = ({ children }) => {
  return (
    <div id="wrapper" className="d-flex">
        <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column w-100">
        <div id="content" className="flex-grow-1">
          <Topbar />
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
