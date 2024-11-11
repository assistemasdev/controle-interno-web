// src/components/companySelection/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; 
import '../../assets/styles/companySelection/Header.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="company-header d-flex align-items-center justify-content-between p-3">
      <div className="header-left d-flex align-items-center">
        <h2 className="mb-0">SISTEMA DE CONTROLE INTERNO</h2>
      </div>
      <button className="menu-toggle d-md-none" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`header-right d-flex align-items-center ${isMobileMenuOpen ? 'd-none d-md-flex' : ''}`}>
        <div className="support d-flex align-items-center">
          <div className="icon-background">
            <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
          </div>
          <span className="support-info ml-2">(88) 99309-8272</span>
        </div>
        <div className="user-info ml-4 d-flex align-items-center">
          <div className="icon-background">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <span className="user-name ml-2">IMNA</span>
          <Link to="/login" className="ml-3 logout-link">
            <div className="icon-background">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
          </Link>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="support d-flex align-items-center">
            <div className="icon-background">
              <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
            </div>
            <span className="support-info ml-2">(88) 99309-8272</span>
          </div>
          <div className="user-info d-flex align-items-center mt-3">
            <div className="icon-background">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <span className="user-name ml-2">IMNA</span>
            <Link to="/login" className="ml-3 logout-link">
              <div className="icon-background">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
