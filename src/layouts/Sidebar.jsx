import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUserTag , faChevronDown, faChevronRight, faDesktop, faHome, faUser, faTruck, faTags, faFolder, faInfoCircle, faObjectGroup  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useOrgan } from '../hooks/useOrgan';
import { useSideBar } from '../hooks/useSideBar';
import MenuItem from '../components/MenuItem';
import { useAuth } from '../hooks/useAuth';
const Sidebar = () => {
    const { selectedOrgan } = useOrgan();
    const { user } = useAuth();
    const { open } = useSideBar();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    const sidebarBackgroundColor = selectedOrgan ? selectedOrgan.color : '#343a40';
  
    useEffect(() => {
        if (selectedOrgan && selectedOrgan.id === 'admin') {
            setMenuItems([
                {
                name: 'Usuários',
                icon: faUserFriends,
                to: '/users',
                href: "collapseUsers",
                dropdown: "users",
                isCollapsed: isCollapsed,
                children: [
                    {
                        name: 'Página Inicial',
                        to: '/usuarios/',
                        requiredPermission: 'show all users', 
                        icon: faHome
                    },
                    {
                        name: 'Cargos',
                        to: '/cargos/',
                        requiredPermission: 'read role',
                        icon: faUserTag
                    }
                ],
                },
                {
                    name: 'Aplicações',
                    icon: faDesktop,
                    to: '/applications',
                    href: "collapseApplications",
                    dropdown: "applications",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: '/aplicacoes/dashboard/',
                        requiredPermission: '',
                        icon: faHome
                        }
                    ]
                },
                {
                    name: 'Condições',
                    icon: faInfoCircle ,
                    to: '/conditions',
                    href: "collapseConditions",
                    dropdown: "conditins",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: `/condicoes/`,
                        requiredPermission: 'Listar condições de produto',
                        icon: faHome
                        }
                    ]
                },
                ,
                {
                    name: 'Categorias',
                    icon: faFolder,
                    to: '/categories',
                    href: "collapseCategories",
                    dropdown: "categories",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: `/categorias/`,
                        requiredPermission: 'Listar categorias de produto',
                        icon: faHome
                        }
                    ]
                }
            ]);
        } else {
            setMenuItems([
                {
                    name: 'Usuário',
                    icon: faUser,
                    to: '/user',
                    href: "collapseUser",
                    dropdown: "user",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Perfil',
                        to: `/usuarios/perfil/${user.id}`,
                        requiredPermission: '',
                        icon: faHome
                        }
                    ]
                },
                {
                    name: 'Fornecedores',
                    icon: faTruck ,
                    to: '/suppliers',
                    href: "collapseSuppliers",
                    dropdown: "suppliers",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: `/fornecedores/`,
                        requiredPermission: 'Listar fornecedores',
                        icon: faHome
                        }
                    ]
                },
                {
                    name: 'Tipos',
                    icon: faTags ,
                    to: '/types',
                    href: "collapseTypes",
                    dropdown: "types",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: `/tipos/`,
                        requiredPermission: 'Listar tipos de produto',
                        icon: faHome
                        }
                    ]
                },
                {
                    name: 'Grupos',
                    icon: faObjectGroup  ,
                    to: '/groups',
                    href: "collapseGroups",
                    dropdown: "groups",
                    isCollapsed: isCollapsed,
                    children: [
                        {
                        name: 'Página Inicial',
                        to: `/grupos/`,
                        requiredPermission: 'Listar grupos de produto',
                        icon: faHome
                        }
                    ]
                }
            ]);
        }
    }, [selectedOrgan, isCollapsed]);


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
                <div key={index + 'A'}>
                <MenuItem
                    key={index}
                    name={item.name}
                    icon={item.icon}
                    to={item.to}
                    requiredPermission={item.requiredPermission}
                    children={item.children}
                />
                <hr className="sidebar-divider" style={{ backgroundColor: '#fff', height: '1px' }} />
                </div>
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
