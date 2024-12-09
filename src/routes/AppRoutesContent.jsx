import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Componentes Gerais
import PrivateRoute from "../components/PrivateRoute";

// Páginas Gerais
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";

// Páginas de Aplicações
import ApplicationSelection from "../pages/ApplicationSelection";
import ApplicationPage from "../pages/application/ApplicationPage";
import CreateApplicationPage from "../pages/application/CreateApplicationPage";
import EditApplicationPage from "../pages/application/EditApplicationPage";

// Páginas de Usuários
import UsersPage from "../pages/users/UsersPage";
import CreateUserPage from "../pages/users/CreateUserPage";
import EditUserPage from "../pages/users/EditUserPage";
import PerfilUserPage from "../pages/users/PerfilUserPage";

// Páginas de Organizações
import CompanySelection from "../pages/CompanySelection";
import OrganizationPage from "../pages/organization/OrganizationPage";
import CreateOrganizationPage from "../pages/organization/CreateOrganizationPage";
import EditOrganizationPage from "../pages/organization/EditOrganizationPage";

// Páginas de Funções (Roles)
import RolePage from "../pages/roles/RolesPage";
import CreateRolePage from "../pages/roles/CreateRolePage";
import EditRolePage from "../pages/roles/EditRolePage";

// Páginas de Fornecedores
import SuppliersPage from "../pages/suppliers/SuppliersPage";
import CreateSupplierPage from "../pages/suppliers/CreateSupplierPage";
import EditSupplierPage from "../pages/suppliers/EditSupplierPage";

// Páginas de Tipos
import TypePage from "../pages/types/TypePage";
import CreateTypePage from "../pages/types/CreateTypePage";
import EditTypePage from "../pages/types/EditTypePage";

// Páginas de Categorias
import CategoryPage from "../pages/categories/CategoryPage";
import CreateCategoryPage from "../pages/categories/CreateCategoryPage";
import EditCategoryPage from "../pages/categories/EditCategoryPage";

// Páginas de Condições
import ConditionPage from "../pages/conditions/ConditionPage";
import CreateConditionPage from "../pages/conditions/CreateConditionPage";
import EditConditionPage from "../pages/conditions/EditConditionPage";

// Páginas de Grupos
import GroupPage from "../pages/groups/GroupPage";
import CreateGroupPage from "../pages/groups/CreateGroupPage";
import EditGroupPage from "../pages/groups/EditGroupPage";
import GroupsTypePage from "../pages/types/groups/GroupsTypePage";
import AttachGroupToTypePage from "../pages/types/groups/AttachGroupToTypePage";

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
        {
            path: "/usuarios/perfil/:id",
            element: <PrivateRoute element={PerfilUserPage} />,
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
        {
            path: "/cargos/editar/:roleId",
            element: <PrivateRoute element={EditRolePage}/>
        }
    ];

    const suppliersRoutes = [
        {
            path: "/fornecedores",
            element: <PrivateRoute element={SuppliersPage} />,
        },
        {
            path: "/fornecedores/criar",
            element: <PrivateRoute element={CreateSupplierPage} />,
        },
        {
            path: "/fornecedores/editar/:id",
            element: <PrivateRoute element={EditSupplierPage}/>
        }
    ];

    const typesRoutes = [
        {
            path: "/tipos",
            element: <PrivateRoute element={TypePage} />,
        },
        {
            path: "/tipos/criar",
            element: <PrivateRoute element={CreateTypePage} />,
        },
        {
            path: "/tipos/editar/:id",
            element: <PrivateRoute element={EditTypePage}/>
        },
        {
            path: "/tipos/:id/grupos",
            element: <PrivateRoute element={GroupsTypePage}/>
        },
        {
            path: "/tipos/:id/grupos/associar",
            element: <PrivateRoute element={AttachGroupToTypePage}/>
        }
    ];

    const categoriesRoutes = [
        {
            path: "/categorias",
            element: <PrivateRoute element={CategoryPage} />,
        },
        {
            path: "/categorias/criar",
            element: <PrivateRoute element={CreateCategoryPage} />,
        },
        {
            path: "/categorias/editar/:id",
            element: <PrivateRoute element={EditCategoryPage}/>
        }
    ];

    const conditionsRoutes = [
        {
            path: "/condicoes",
            element: <PrivateRoute element={ConditionPage} />,
        },
        {
            path: "/condicoes/criar",
            element: <PrivateRoute element={CreateConditionPage} />,
        },
        {
            path: "/condicoes/editar/:id",
            element: <PrivateRoute element={EditConditionPage}/>
        }
    ];

    const groupsRoutes = [
        {
            path: "/grupos",
            element: <PrivateRoute element={GroupPage} />,
        },
        {
            path: "/grupos/criar",
            element: <PrivateRoute element={CreateGroupPage} />,
        },
        {
            path: "/grupos/editar/:id",
            element: <PrivateRoute element={EditGroupPage}/>
        }
    ];

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

                {suppliersRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {typesRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {categoriesRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {conditionsRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {groupsRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AppRoutesContent;
