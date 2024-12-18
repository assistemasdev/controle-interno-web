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
import SupplierDetailsPage from "../pages/suppliers/SupplierDetailsPage";
import EditSupplierAddressPage from "../pages/suppliers/address/EditSupplierAddressPage";
import SupplierAddressDetailsPage from "../pages/suppliers/address/SupplierAddressDetailsPage";
import CreateSupplierAddressPage from "../pages/suppliers/address/CreateSupplierAddressPage";
import UnitPage from "../pages/units/UnitPage";
import CreateUnitPage from "../pages/units/CreateUnitPage";
import EditUnitPage from "../pages/units/EditUnitPage";
import UnitsRelatedPage from "../pages/units/unitsRelated/UnitsRelatedPage";
import AttachUnitsRelatedPage from "../pages/units/unitsRelated/AttachUnitsRelatedPage";
import ProductsPage from "../pages/products/ProductPage";
import CreateProductPage from "../pages/products/CreateProductPage";
import OrganizationDetailsPage from "../pages/organization/OrganizationDetailsPage";
import CreateOrganizationAddressPage from "../pages/organization/address/CreateOrganizationAddressPage";
import EditOrganizationAddressPage from "../pages/organization/address/EditOrganizationAddressPage";
import OrganizationAddressDetailsPage from "../pages/organization/address/OrganizationAddressDetailsPage";
import CreateOrganizationContactPage from "../pages/organization/contact/CreateOrganizationContactPage";
import EditOrganizationContactPage from "../pages/organization/contact/EditOrganizationContactPage";
import LocationOrganizationPage from "../pages/organization/locations/LocationOrganizationPage";
import CreateOrganizationLocationPage from "../pages/organization/locations/CreateOrganizationLocationPage";
import EditOrganizationLocationPage from "../pages/organization/locations/EditOrganizationLocationPage";
import DetailsOrganizationLocationPage from "../pages/organization/locations/DetailsOrganizationLocationPage";
import CreateSupplierContactPage from "../pages/suppliers/contact/CreateSupplierContactPage";
import EditSupplierContactPage from "../pages/suppliers/contact/EditSupplierContactPage";

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
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId",
            element: <PrivateRoute element={OrganizationDetailsPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/adicionar",
            element: <PrivateRoute element={CreateOrganizationAddressPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/editar/:addressId",
            element: <PrivateRoute element={EditOrganizationAddressPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/detalhes/:addressId",
            element: <PrivateRoute element={OrganizationAddressDetailsPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/contatos/adicionar/",
            element: <PrivateRoute element={CreateOrganizationContactPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/contatos/editar/:contactId",
            element: <PrivateRoute element={EditOrganizationContactPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/:addressId/localizacoes",
            element: <PrivateRoute element={LocationOrganizationPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/:addressId/localizacoes/adicionar",
            element: <PrivateRoute element={CreateOrganizationLocationPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/:addressId/localizacoes/editar/:locationId",
            element: <PrivateRoute element={EditOrganizationLocationPage} />,
        },
        {
            path: "/orgaos/detalhes/:applicationId/:organizationId/enderecos/:addressId/localizacoes/detalhes/:locationId",
            element: <PrivateRoute element={DetailsOrganizationLocationPage} />,
        }
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
        },
        {
            path: "/fornecedores/detalhes/:id",
            element: <PrivateRoute element={SupplierDetailsPage}/>
        },
        {
            path: "/fornecedores/editar/:id/endereco/:addressId",
            element: <PrivateRoute element={EditSupplierAddressPage}/>
        },
        {
            path: "/fornecedores/:id/endereco/:addressId/detalhes",
            element: <PrivateRoute element={SupplierAddressDetailsPage}/>
        },
        {
            path: "/fornecedores/:id/endereco/adicionar",
            element: <PrivateRoute element={CreateSupplierAddressPage}/>
        },
        {
            path: "/fornecedores/:id/contato/adicionar",
            element: <PrivateRoute element={CreateSupplierContactPage}/>
        },
        {
            path: "/fornecedores/:supplierId/contato/editar/:contactId",
            element: <PrivateRoute element={EditSupplierContactPage}/>
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

    const unitsRoutes = [
        {
            path: "/unidades",
            element: <PrivateRoute element={UnitPage} />,
        },
        {
            path: "/unidades/criar",
            element: <PrivateRoute element={CreateUnitPage} />,
        },
        {
            path: "/unidades/editar/:id",
            element: <PrivateRoute element={EditUnitPage}/>
        },
        {
            path: "/unidades/:id/relacionadas",
            element: <PrivateRoute element={UnitsRelatedPage}/>
        },
        {
            path: "/unidades/:id/relacionadas/criar",
            element: <PrivateRoute element={AttachUnitsRelatedPage}/>
        },

    ];

    const productsRoutes = [
        {
            path: "/produtos",
            element: <PrivateRoute element={ProductsPage} />,
        },
        {
            path: "/produtos/criar",
            element: <PrivateRoute element={CreateProductPage} />,
        },
        {
            path: "/categorias/editar/:id",
            element: <PrivateRoute element={EditCategoryPage}/>
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

                {unitsRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                {productsRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
                
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AppRoutesContent;
