import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PrivateRoute from "../components/PrivateRoute";

// Páginas de Aplicação
import ApplicationSelection from "../pages/ApplicationSelection";
import ApplicationPage from "../pages/application/ApplicationPage";
import CreateApplicationPage from "../pages/application/CreateApplicationPage";
import EditApplicationPage from "../pages/application/EditApplicationPage";

// Páginas de Usuário
import UsersPage from "../pages/users/UsersPage";
import CreateUserPage from "../pages/users/CreateUserPage";
import EditUserPage from "../pages/users/EditUserPage";

// Páginas de Organizações
import CompanySelection from "../pages/CompanySelection";
import OrganizationPage from "../pages/organization/OrganizationPage";
import CreateOrganizationPage from "../pages/organization/CreateOrganizationPage";
import EditOrganizationPage from "../pages/organization/EditOrganizationPage";

// Outras Páginas
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import RolePage from "../pages/roles/RolesPage";
import CreateRolePage from "../pages/roles/CreateRolePage";

const AppRoutesContent = () => {
  const location = useLocation();

  const applicationRoutes = [
    {
      path: "/aplicacoes",
      element: <PrivateRoute element={ApplicationSelection} />,
    },
    {
      path: "/aplicacoes/dashboard",
      element: <PrivateRoute element={ApplicationPage} />,
    },
    {
      path: "/aplicacoes/criar",
      element: <PrivateRoute element={CreateApplicationPage} />,
    },
    {
      path: "/aplicacoes/editar/:id",
      element: <PrivateRoute element={EditApplicationPage} />,
    },
  ];

  const userRoutes = [
    {
      path: "/usuarios",
      element: <PrivateRoute element={UsersPage} />,
    },
    {
      path: "/usuarios/criar",
      element: <PrivateRoute element={CreateUserPage} />,
    },
    {
      path: "/usuarios/editar/:id",
      element: <PrivateRoute element={EditUserPage} />,
    },
  ];

  const organizationRoutes = [
    {
      path: "/orgaos",
      element: <PrivateRoute element={CompanySelection} />,
    },
    {
      path: "/orgaos/:applicationId",
      element: <PrivateRoute element={OrganizationPage} />,
    },
    {
      path: "/orgaos/criar/:applicationId",
      element: <PrivateRoute element={CreateOrganizationPage} />,
    },
    {
      path: "/orgaos/editar/:applicationId/:organizationId",
      element: <PrivateRoute element={EditOrganizationPage} />,
    },
  ];

  const roleRoutes = [
    {
      path: "/cargos",
      element: <PrivateRoute element={RolePage} />,
    },
    {
      path: "/cargos/criar",
      element: <PrivateRoute element={CreateRolePage} />,
    },
  ]

  const otherRoutes = [
    {
      path: "/dashboard",
      element: <PrivateRoute element={Dashboard} />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page-transition" timeout={500}>
        <Routes location={location}>
          {applicationRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {userRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {organizationRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {otherRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {roleRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AppRoutesContent;
