import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions'; 
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const MenuItem = ({ name, to, icon, children, href, dropdown, isCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { canAccess } = usePermissions();
  const hasSubmenu = children && children.length > 0;

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown); 
  };

  return (
    <li className="nav-item">
        <a
          className="nav-link d-flex justify-content-between"
          href={`#${href}`}
          onClick={() => toggleDropdown(dropdown)}
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={icon} className="mr-3" />
            <span className={`option-sidebar ${isCollapsed ? 'd-none' : ''}`}>{name}</span>
          </div>
          <FontAwesomeIcon icon={openDropdown === dropdown ? faChevronDown : faChevronRight} className="ml-auto" />
        </a>
        {hasSubmenu && (
          <div
            id={href}
            className={`collapse ${openDropdown === dropdown ? 'show' : ''}`}
            aria-labelledby="headingUsers"
            data-bs-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
            {children.map((child, index) => {
                if (child.requiredPermission && !canAccess(child.requiredPermission)) {
                  return null; 
                }

                return (
                    <Link key={index} className="collapse-item" to={child.to} >
                      <FontAwesomeIcon icon={child.icon} className="mr-3" />
                      {child.name}
                    </Link>
                );
            })}
            </div>
          </div>
        )}
    </li>
  );
};

export default MenuItem;
