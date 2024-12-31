import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBars, faUser, faMoon, faSignOutAlt, faUsers, faUserFriends, faUserTag, faChevronDown, faChevronRight, faDesktop, faHome, faTruck, faTags, faFolder, faInfoCircle, faObjectGroup, faRuler, faBox } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/sidebar/header.css";
import "../assets/styles/sidebar/sidebar.css";
import perfil from "../assets/img/perfil.png";
import { useAuth } from "../hooks/useAuth";
import UserService from "../services/UserService";
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';

const SideBarTwo = ({ children }) => {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });
    const navigate = useNavigate();
    const { selectedOrgan } = useOrgan();
    const [loading, setLoading] = useState(null);
    const [menuSections, setMenuSections] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();  
        navigate('/login');  
    };

    useEffect(() => {
        if (selectedOrgan && selectedOrgan.id === 'admin') {
            setMenuSections([
                {
                    title: 'Administração',
                    items: [
                        { name: 'Usuários', icon: faUserFriends, to: '/usuarios' },
                        { name: 'Aplicações', icon: faDesktop, to: '/aplicacoes/dashboard' },
                        { name: 'Condições', icon: faInfoCircle, to: '/condicoes' },
                        { name: 'Categorias', icon: faFolder, to: '/categorias' }
                    ]
                }
            ]);
        } else {
            setMenuSections([
                {
                    title: 'Usuário',
                    items: [
                        { name: 'Perfil', icon: faUser, to: `/usuarios/perfil/${user.id}` },
                        { name: 'Clientes', icon: faUsers, to: '/clientes' }
                    ]
                },
                {
                    title: 'Produtos',
                    items: [
                        { name: 'Produtos', icon: faBox, to: '/produtos' },
                        { name: 'Fornecedores', icon: faTruck, to: '/fornecedores' },
                        { name: 'Tipos', icon: faTags, to: '/tipos' },
                        { name: 'Grupos', icon: faObjectGroup, to: '/grupos' },
                        { name: 'Unidades', icon: faRuler, to: '/unidades' }
                    ]
                }
            ]);
        }
    }, [selectedOrgan]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await UserService.getById(user.id);
            setUserData({
                name: response.result.name,
                email: response.result.email,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(
        localStorage.getItem("selected-theme") === "dark"
    );

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
        document.querySelector(".main").classList.toggle("left-pd", !isSidebarVisible);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        document.body.classList.toggle("dark-theme", newTheme);

        localStorage.setItem("selected-theme", newTheme ? "dark" : "light");
        localStorage.setItem("selected-icon", newTheme ? "ri-moon-clear-fill" : "ri-sun-fill");
    };

    useEffect(() => {
        if (isDarkTheme) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    }, [isDarkTheme]);

    const handleActiveLink = (e) => {
        document.querySelectorAll(".sidebar_link").forEach((link) => {
            link.classList.remove("active-link");
        });
        e.currentTarget.classList.add("active-link");
    };

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center mt-4">
                    <CircularProgress size={50}></CircularProgress>
                </div>
            ) : (
                <>
                    <header className={`header ${isSidebarVisible ? "left-pd" : ""}`}>
                        <div className={`header_container`}>
                            <a href="#" className="header_logo">
                                <FontAwesomeIcon icon={faBuilding} className="header_logo_icon" />
                                <span>ADI</span>
                            </a>
                            <button className="header_toggle" onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faBars} className="header_toggle_icon" />
                            </button>
                        </div>
                    </header>

                    <nav className={`sidebar ${isSidebarVisible ? "show_sidebar" : ""}`}>
                        <div className="sidebar_container">
                            <div className="sidebar_user">
                                <div className="sidebar_img">
                                    <img src={perfil} alt="perfil" />
                                </div>
                                <div className="sidebar_info">
                                    <h3>{userData.name}</h3>
                                    <span>{userData.email}</span>
                                </div>
                            </div>

                            <div className="sidebar_content">
                                {menuSections.map((section, sectionIndex) => (
                                    <div key={sectionIndex}>
                                        <h3 className="sidebar_title">{section.title}</h3>
                                        <div className="sidebar_list">
                                            {section.items.map((item, itemIndex) => (
                                                <a href={item.to} key={itemIndex} className="sidebar_link" onClick={handleActiveLink}>
                                                    <FontAwesomeIcon icon={item.icon} />
                                                    <span>{item.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="sidebar_actions">
                                <button className="btn-side sidebar_icon" onClick={toggleTheme}>
                                    <FontAwesomeIcon icon={faMoon} />
                                    <span>Tema</span>
                                </button>
                                <button onClick={handleLogout} className="btn-side sidebar_link">
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                    <span>Desconectar</span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    <main className={`main container-main ${isSidebarVisible ? "left-pd" : ""}`}>
                        {children}
                    </main>
                </>
            )}
        </>
    );
};

export default SideBarTwo;
