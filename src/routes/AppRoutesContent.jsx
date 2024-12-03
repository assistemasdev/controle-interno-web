import React from "react";
import { Routes, Route, useLocation, Navigate  } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/users/UsersPage";
import CreateUserPage from "../pages/users/CreateUserPage";
import EditUserPage from "../pages/users/EditUserPage";
import CompanySelection from "../pages/CompanySelection";
import ApplicationSelection from "../pages/ApplicationSelection";
import PrivateRoute from "../components/PrivateRoute";
import "../assets/styles/pageTransitions.css";

const AppRoutesContent = () => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page-transition" timeout={500}>
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute element={Dashboard} />
            }
          />
          <Route
            path="/aplicacoes"
            element={
              <PrivateRoute element={ApplicationSelection} />
            }
          />
          <Route
            path="/orgaos"
            element={
              <PrivateRoute element={CompanySelection} />
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute element={UsersPage} />
            }
          />
          <Route
            path="/usuarios/criar"
            element={
              <PrivateRoute element={CreateUserPage} />
            }
          />
          <Route
            path="/usuarios/editar/:id"
            element={
              <PrivateRoute element={EditUserPage} />
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AppRoutesContent;
