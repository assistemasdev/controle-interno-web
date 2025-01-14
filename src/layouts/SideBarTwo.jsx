import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBriefcase, faBars, faUser, faMoon, faSignOutAlt, faUsers, faUserFriends, faArrowLeft , faDesktop, faTruck, faTags, faFolder, faInfoCircle, faObjectGroup, faRuler, faBox } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/sidebar/header.css";
import "../assets/styles/sidebar/sidebar.css";
import perfil from "../assets/img/perfil.png";
import { useAuth } from "../hooks/useAuth";
import UserService from "../services/UserService";
import { useNavigate } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';
import { usePermissions } from "../hooks/usePermissions";
import useLoader from "../hooks/useLoader";

const SideBarTwo = ({ children }) => {
    const { user, logout } = useAuth();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });
    const navigate = useNavigate();
    const { selectedOrgan, clearOrganSelection } = useOrgan();
    const [menuSections, setMenuSections] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();  
        navigate('/login');  
    };

    useEffect(() => {
        let sections = [];

        if (selectedOrgan && selectedOrgan.id === 'admin') {
            sections = [
                {
                    title: 'Administração',
                    items: [
                        { name: 'Usuários', icon: faUserFriends, to: '/usuarios', requiredPermission: 'show all users' },
                        { name: 'Cargos', icon: faBriefcase, to: '/cargos', requiredPermission: 'Listar cargos' },
                        { name: 'Aplicações', icon: faDesktop, to: '/aplicacoes/dashboard', requiredPermission: 'Listar aplicações' },
                        { name: 'Organizações', icon: faBuilding, to: '/organizacoes/dashboard', requiredPermission: 'Listar organizações' },
                        { name: 'Condições', icon: faInfoCircle, to: '/condicoes', requiredPermission: 'Listar condições de produto' },
                        { name: 'Categorias', icon: faFolder, to: '/categorias', requiredPermission: 'Listar categorias de produto' }
                    ].filter(item => canAccess(item.requiredPermission))
                }
            ];
        } else {
            sections = [
                {
                    title: 'Usuário',
                    items: [
                        { name: 'Perfil', icon: faUser, to: `/usuarios/perfil/${user.id}`, requiredPermission: '' },
                        { name: 'Clientes', icon: faUsers, to: '/clientes', requiredPermission: 'Listar clientes' }
                    ].filter(item => canAccess(item.requiredPermission))
                },
                {
                    title: 'Produtos',
                    items: [
                        { name: 'Produtos', icon: faBox, to: '/produtos', requiredPermission: 'Listar produtos' },
                        { name: 'Fornecedores', icon: faTruck, to: '/fornecedores', requiredPermission: 'Listar fornecedores' },
                        { name: 'Tipos', icon: faTags, to: '/tipos', requiredPermission: 'Listar tipos de produto' },
                        { name: 'Grupos', icon: faObjectGroup, to: '/grupos', requiredPermission: 'Listar grupos de produto' },
                        { name: 'Unidades', icon: faRuler, to: '/unidades', requiredPermission: 'Listar unidades de medida' }
                    ].filter(item => canAccess(item.requiredPermission))
                }
            ];
        }

        const filteredSections = sections.filter(section => section.items.length > 0);
        setMenuSections(filteredSections);

        if (filteredSections.length === 0) {
            setMenuSections([
                {
                    title: 'Sem Permissões',
                    items: [
                        { name: 'Nenhum item disponível', icon: faInfoCircle, to: '#' }
                    ]
                }
            ]);
        }
    }, [selectedOrgan, canAccess]);

    const fetchUser = async () => {
        try {
            showLoader();
            const response = await UserService.getById(user.id);
            setUserData({
                name: response.result.name,
                email: response.result.email,
            });
        } catch (error) {
            console.log(error);
        } finally {
            hideLoader();
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
                        <button onClick={clearOrganSelection} className="btn-side sidebar_link">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span>Voltar</span>
                        </button>
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
    );
};

export default SideBarTwo;
