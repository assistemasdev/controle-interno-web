import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../hooks/useAuth';  
import { useSideBar } from '../hooks/useSideBar';

const Topbar = () => {
  const navigate = useNavigate();  
  const { logout } = useAuth();  
  const { openOrClose } = useSideBar();

  const handleLogout = () => {
    logout();  
    navigate('/login');  
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav w-100 d-flex align-items-center justify-content-between">

        {/* Ícone do hambúrguer (faBars) */}
        <li className="nav-item open-sidebar">
          <a className="nav-link" href="#!" onClick={openOrClose}>
            <FontAwesomeIcon icon={faBars} className="fa-fw" style={{ fontSize: '1.5em', color: '#333' }} />
          </a>
        </li>

        {/* Ícone de logout (faSignOutAlt) */}
        <li className="nav-item d-flex align-items-center">
          <a className="nav-link" href="#!" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="fa-fw" style={{ fontSize: '1.5em', color: '#333' }} />
          </a>
        </li>

      </ul>
    </nav>
  );
};

export default Topbar;
