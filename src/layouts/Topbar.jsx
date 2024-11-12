import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../hooks/useAuth';  

const Topbar = () => {
  const navigate = useNavigate();  
  const { user, logout } = useAuth();  

  const handleLogout = () => {
    logout();  
    navigate('/login');  
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav ml-auto d-flex align-items-center">
        
        <li className="nav-item dropdown no-arrow mx-1 d-flex align-items-center">
          <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <div className="d-flex align-items-center" style={{ backgroundColor: '#f8f9fa', borderRadius: '50px', padding: '5px 15px' }}>
              <FontAwesomeIcon icon={faUser} className="fa-fw" style={{ fontSize: '1em', color: '#333' }} />
              <span className="ml-2" style={{ color: '#333', fontWeight: 'bold' }}>
                {user ? user.name : 'Usuário'} 
              </span>
            </div>
          </a>
        </li>

        <li>
          <a 
            className="dropdown-item d-flex align-items-center" 
            href="#" 
            style={{ backgroundColor: '#e74a3b', borderRadius: '50px', color: 'white' }} 
            onClick={handleLogout}  
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="py-1" />
          </a>
        </li>

      </ul>
    </nav>
  );
};

export default Topbar;
