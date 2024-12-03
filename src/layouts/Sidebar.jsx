import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUsers, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';
import { useSideBar } from '../hooks/useSideBar';
import MenuItem from '../components/MenuItem';
const Sidebar = () => {
  const { selectedOrgan } = useOrgan();
  const { open } = useSideBar();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarBackgroundColor = selectedOrgan ? selectedOrgan.color : '#343a40';

  const menuItems = [
    {
      name: 'Usuários',
      icon: faUserFriends,
      to: '/users',
      href:"collapseUsers",
      dropdown:"users",
      isCollapsed: isCollapsed,
      children: [
        {
          name: 'Página Inicial',
          to: '/usuarios/',
          requiredPermission: 'show all users', 
          icon: faUsers
        },
      ],
    }
  ]

  return (
    <ul
      className={`navbar-nav sidebar sidebar-dark accordion ${!open ? '' : 'mobile'} ${isCollapsed ? 'toggled' : ''}`}
      style={{ backgroundColor: sidebarBackgroundColor }}
    >
      <Link className="d-flex align-items-center justify-content-center" to="/dashboard">
        <div className="sidebar-brand-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="sidebar-brand-text mx-3 py-4 text-white font-weight-bold">ADI</div>
      </Link>

      <hr className="sidebar-divider" style={{ backgroundColor: '#fff', height: '1px' }} />

      {menuItems.map((item, index) => (
        <>
          <MenuItem
            key={index}
            name={item.name}
            icon={item.icon}
            to={item.to}
            requiredPermission={item.requiredPermission}
            children={item.children}
          />
          <hr className="sidebar-divider" style={{ backgroundColor: '#fff', height: '1px' }} />
        </>
      ))}
      <div className="text-center d-none d-md-inline my-3">
        <button className="rounded-circle border-0 py-1 px-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} />
        </button>
      </div>
    </ul>
  );
};

export default Sidebar;
