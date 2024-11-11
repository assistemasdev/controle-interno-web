// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/layouts/sidebar.css';

const companyColors = {
  ALUCOM: '#BF2626',
  MOREIA: 'DarkOrange',
  default: '#5d8dbb',
};

const Sidebar = ({ selectedCompany }) => {
  const bgColor = companyColors[selectedCompany] || companyColors.default;

  return (
    <div className="sidebar" style={{ backgroundColor: bgColor }}>
      {/* Sidebar - Brand */}
      <div className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Tabula</div>
      </div>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Dashboard */}
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - RD Station */}
      <li className="nav-item">
        <Link to="/rd-station" className="nav-link">
          <i className="fas fa-project-diagram"></i>
          <span>RD Station</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">Informações dos Usuários</div>

      {/* Nav Item - Usuários */}
      <li className="nav-item">
        <Link to="#" className="nav-link collapsed" data-toggle="collapse" data-target="#collapseUsers" aria-expanded="true" aria-controls="collapseUsers">
          <i className="fas fa-user-friends"></i>
          <span>Usuários</span>
        </Link>
        <div id="collapseUsers" className="collapse" aria-labelledby="headingUsers">
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/usuarios/admin">Administradores</Link>
            <Link className="collapse-item" to="/usuarios/usuarios">Usuários</Link>
            <Link className="collapse-item" to="/usuarios/conquistas">Conquistas Usuário</Link>
            <Link className="collapse-item" to="/usuarios/contas-bancarias">Contas Bancárias</Link>
            <Link className="collapse-item" to="/usuarios/empresas">Empresas</Link>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">Informações dos Cursos</div>

      {/* Nav Item - Cursos */}
      <li className="nav-item">
        <Link to="#" className="nav-link collapsed" data-toggle="collapse" data-target="#collapseCourses" aria-expanded="true" aria-controls="collapseCourses">
          <i className="fas fa-book"></i>
          <span>Cursos</span>
        </Link>
        <div id="collapseCourses" className="collapse" aria-labelledby="headingCourses">
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/cursos">Cursos</Link>
            <Link className="collapse-item" to="/cursos/categorias">Categorias</Link>
            <Link className="collapse-item" to="/cursos/subcategorias">SubCategorias</Link>
            <Link className="collapse-item" to="/cursos/dados">Dados Cursos</Link>
            <Link className="collapse-item" to="/cursos/destaque">Cursos em Destaque</Link>
            <Link className="collapse-item" to="/cursos/live">Live</Link>
            <Link className="collapse-item" to="/cursos/mentoria">Cursos com Mentoria</Link>
            <Link className="collapse-item" to="/cursos/marcas">Marcas</Link>
            <Link className="collapse-item" to="/cursos/banner-marcas">Banner Marcas</Link>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">Notificações do Sistema</div>

      {/* Nav Item - Notificações */}
      <li className="nav-item">
        <Link to="#" className="nav-link collapsed" data-toggle="collapse" data-target="#collapseNotifications" aria-expanded="true" aria-controls="collapseNotifications">
          <i className="fas fa-bell"></i>
          <span>Notificação</span>
          <span className="badge bg-gradient-light text-black-50 pt-0 pb-0">4</span>
        </Link>
        <div id="collapseNotifications" className="collapse" aria-labelledby="headingNotifications">
          <div className="bg-white py-2 collapse-inner rounded">
            <Link className="collapse-item" to="/notificacoes/admin">Admin <span className="badge bg-info text-bg-secondary">4</span></Link>
            <Link className="collapse-item" to="/notificacoes/usuario">Usuário <span className="badge bg-info text-bg-secondary">4</span></Link>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Sidebar Toggler */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </div>
  );
};

export default Sidebar;
