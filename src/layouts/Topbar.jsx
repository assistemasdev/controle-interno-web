import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';  
import { useNavigate } from 'react-router-dom';  
import { useAuth } from '../hooks/useAuth';  
import { useSideBar } from '../hooks/useSideBar';

const Topbar = () => {
    const [icon, setIcon] = useState(faTimes); 
    const navigate = useNavigate();  
    const { logout } = useAuth();  
    const { openOrClose } = useSideBar();

    const handleLogout = () => {
        logout();  
        navigate('/login');  
    };

    const toggleIcon = () => {
        setIcon(prevIcon => (prevIcon === faBars ? faTimes : faBars)); 
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <ul className="navbar-nav w-100 d-flex align-items-center justify-content-between">
            <li className="nav-item open-sidebar">
            <a className="nav-link" href="#!" onClick={() => { openOrClose(); toggleIcon(); }}>
                <FontAwesomeIcon 
                icon={icon} 
                className="fa-fw transition-all"  
                style={{ fontSize: '1.5em', color: '#333' }} 
                />
            </a>
            </li>

            <li className="nav-item d-flex align-items-center">
            <a className="nav-link" href="#!" onClick={handleLogout}>
                <FontAwesomeIcon 
                icon={faSignOutAlt} 
                className="fa-fw" 
                style={{ fontSize: '1.5em', color: '#333' }} 
                />
            </a>
            </li>
        </ul>
        </nav>
    );
};

export default Topbar;
