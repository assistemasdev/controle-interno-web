import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUsers, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);  
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); 
  };

  return (
    <ul
      className={`navbar-nav sidebar sidebar-dark accordion ${isCollapsed ? 'toggled' : ''}`}
      style={{ backgroundColor: 'var(--blue-light)' }}  // Aplica a cor de fundo da sidebar
    >
      <a className="d-flex align-items-center justify-content-center" href="index.html">
        <div className="sidebar-brand-icon">
            <i className="fas fa-users"></i>
        </div>
        <div className="sidebar-brand-text mx-3 py-4 text-white font-weight-bold">ADI</div>
      </a>

      <hr className="sidebar-divider" style={{ backgroundColor: '#fff', height: '1px' }} />

      <li className="nav-item">
        <a
          className="nav-link d-flex justify-content-between"
          href="#collapseUsers"
          onClick={() => toggleDropdown('users')} 
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
            <span className={`${isCollapsed ? 'd-none' : ''}`}>Usuários</span>
          </div>
          <FontAwesomeIcon icon={openDropdown === 'users' ? faChevronDown : faChevronRight} className="ml-auto" />
        </a>
        <div
          id="collapseUsers"
          className={`collapse ${openDropdown === 'users' ? 'show' : ''}`}
          aria-labelledby="headingUsers"
          data-bs-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/usuarios">
              <FontAwesomeIcon icon={faUsers} className="mr-3" />
              Página Inicial
            </Link>
          </div>
        </div>
      </li>

      <hr className="sidebar-divider" style={{ backgroundColor: '#fff', height: '1px' }} />

      <div className="text-center d-none d-md-inline my-3">
        <button className="rounded-circle border-0 py-1 px-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} />
        </button>
      </div>
    </ul>
  );
};

export default Sidebar;
