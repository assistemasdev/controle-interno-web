import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faUsers, faUser, faCoins, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Ícones do FontAwesome
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);  // Único estado para controlar o dropdown aberto
  const [isCollapsed, setIsCollapsed] = useState(false);  // Estado para controlar o botão de toggle da sidebar

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown); // Alterna entre abrir e fechar o dropdown
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Alterna entre colapsar e expandir a sidebar
  };

  return (
    <ul className={`navbar-nav bg-gray-900 sidebar sidebar-dark accordion ${isCollapsed ? 'toggled' : ''}`} id="accordionSidebar">
      {/* Logo e Nome da Sidebar */}
      <a className="d-flex align-items-center justify-content-center" href="index.html">
        <div className="sidebar-brand-icon">
            <i className="fas fa-users"></i>
        </div>
        {/* O nome "ADI" vai continuar visível, não importa se a sidebar está colapsada */}
        <div className="sidebar-brand-text mx-3 py-4 text-white font-weight-bold">ADI</div>
        </a>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Link com opções colapsáveis - Usuários */}
      <li className="nav-item">
        <a
          className="nav-link d-flex justify-content-between"
          href="#collapseTwo"
          onClick={() => toggleDropdown('users')} // Passa a chave 'users' para controlar este dropdown
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
            <span className={`${isCollapsed ? 'd-none' : ''}`}>Usuários</span> {/* O nome desaparece se sidebar for colapsada */}
          </div>
          {/* Icone da seta, dependendo do estado */}
          <FontAwesomeIcon icon={openDropdown === 'users' ? faChevronDown : faChevronRight} className="ml-auto" />
        </a>
        <div
          id="collapseTwo"
          className={`collapse ${openDropdown === 'users' ? 'show' : ''}`} // Colapsa ou expande baseado no estado
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/usuarios/tables.html">
              <FontAwesomeIcon icon={faUsers} className="mr-3" />
              Administradores
            </Link>
            <Link className="collapse-item" to="/usuarios/tables_user.html">
              <FontAwesomeIcon icon={faUser} className="mr-3" />
              Usuário
            </Link>
            <Link className="collapse-item" to="/usuarios/tables_conquistas.html">
              <FontAwesomeIcon icon={faCoins} className="mr-3" />
              Conquistas Usuário
            </Link>
            <Link className="collapse-item" to="/usuarios/contas_bancarias.html">
              <FontAwesomeIcon icon={faCoins} className="mr-3" />
              Contas Bancarias
            </Link>
            <Link className="collapse-item" to="/usuarios/tables_empresas.html">
              <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
              Empresas
            </Link>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Link com opções colapsáveis - Tipos de Equipamentos */}
      <li className="nav-item">
        <a
          className="nav-link d-flex justify-content-between"
          href="#collapseEquipments"
          onClick={() => toggleDropdown('equipments')} // Passa a chave 'equipments' para controlar este dropdown
        >
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
            <span className={`${isCollapsed ? 'd-none' : ''}`}>Tipos de Equipamentos</span> {/* O nome desaparece se sidebar for colapsada */}
          </div>
          {/* Icone da seta, dependendo do estado */}
          <FontAwesomeIcon icon={openDropdown === 'equipments' ? faChevronDown : faChevronRight} className="ml-auto" />
        </a>
        <div
          id="collapseEquipments"
          className={`collapse ${openDropdown === 'equipments' ? 'show' : ''}`} // Colapsa ou expande baseado no estado
          aria-labelledby="headingEquipments"
          data-bs-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/equipamentos/tipos.html">
              <FontAwesomeIcon icon={faUser} className="mr-3" />
              Tipos de Equipamentos
            </Link>
            <Link className="collapse-item" to="/equipamentos/itens.html">
              <FontAwesomeIcon icon={faUser} className="mr-3" />
              Itens de Equipamentos
            </Link>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />

      {/* Botão de Toggle para a Sidebar */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0 py-1 px-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} />
        </button>
      </div>
    </ul>
  );
};

export default Sidebar;
