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
import AttachGroupToTypePage from "../pages/types/groups/AttachGroupToTypePage";
import SupplierDetailsPage from "../pages/suppliers/SupplierDetailsPage";
import EditSupplierAddressPage from "../pages/suppliers/address/EditSupplierAddressPage";
import SupplierAddressDetailsPage from "../pages/suppliers/address/SupplierAddressDetailsPage";
import CreateSupplierAddressPage from "../pages/suppliers/address/CreateSupplierAddressPage";
import UnitPage from "../pages/units/UnitPage";
import CreateUnitPage from "../pages/units/CreateUnitPage";
import EditUnitPage from "../pages/units/EditUnitPage";
import AttachUnitsRelatedPage from "../pages/units/unitsRelated/AttachUnitsRelatedPage";
import ProductsPage from "../pages/products/ProductPage";
import CreateProductPage from "../pages/products/CreateProductPage";
import OrganizationDetailsPage from "../pages/organization/OrganizationDetailsPage";
import CreateOrganizationAddressPage from "../pages/organization/address/CreateOrganizationAddressPage";
import EditOrganizationAddressPage from "../pages/organization/address/EditOrganizationAddressPage";
import OrganizationAddressDetailsPage from "../pages/organization/address/OrganizationAddressDetailsPage";
import LocationOrganizationPage from "../pages/organization/locations/LocationOrganizationPage";
import CreateOrganizationLocationPage from "../pages/organization/locations/CreateOrganizationLocationPage";
import EditOrganizationLocationPage from "../pages/organization/locations/EditOrganizationLocationPage";
import DetailsOrganizationLocationPage from "../pages/organization/locations/DetailsOrganizationLocationPage";
import CreateSupplierContactPage from "../pages/suppliers/contact/CreateSupplierContactPage";
import EditSupplierContactPage from "../pages/suppliers/contact/EditSupplierContactPage";
import CostumerPage from "../pages/costumer/CostumerPage";
import CreateCustomerPage from "../pages/costumer/CreateCostumerPage";
import EditCustomerPage from "../pages/costumer/EditCustomerPage";
import CustomerDetailsPage from "../pages/costumer/CustomerDetailsPage";
import CostumerAddressDetailsPage from "../pages/costumer/address/CostumerAddressDetailsPage";
import EditCustomerAddressPage from "../pages/costumer/address/EditCustomerAddressPage";
import EditCustomerContactPage from "../pages/costumer/contact/EditCustomerContactPage";
import CreateCustomerContactPage from "../pages/costumer/contact/CreateCustomerContactPage";
import CreateCustomerAddressPage from "../pages/costumer/address/CreateCustomerAddressPage";
import LocationCustomerPage from "../pages/costumer/locations/LocationCustomerPage";
import CreateCustomerLocationPage from "../pages/costumer/locations/CreateCustomerLocationPage";
import EditCustomerLocationPage from "../pages/costumer/locations/EditCustomerLocationPage";
import DetailsCustomerLocationPage from "../pages/costumer/locations/DetailsOrganizationLocationPage";
import EditProductPage from "../pages/products/EditProductPage";
import DetailsProductPage from "../pages/products/DetailsProductPage";
import UserOrganizationsPage from "../pages/users/organizations/UserOrganizationsPage";
import CalendarPage from "../pages/contracts/CalendarPage";
import TypeContractPage from "../pages/contracts/typesContracts/TypeContractPage";
import CreateTypeContractPage from "../pages/contracts/typesContracts/CreateTypeContractPage";
import EditTypeContractPage from "../pages/contracts/typesContracts/EditTypeContractPage";
import StatusContractPage from "../pages/contracts/status/StatusContractPage";
import CreateStatusContractPage from "../pages/contracts/status/CreateStatusContractPage";
import ContractPage from "../pages/contracts/contract/ContractPage";
import CreateContractPage from "../pages/contracts/contract/CreateContractPage";
import TypeEventsPage from "../pages/contracts/typesEvents/TypeEventsPage"
import CreateTypeEventsPage from "../pages/contracts/typesEvents/CreateTypeEventsPage";
import DetailsTypeEventsPage from "../pages/contracts/typesEvents/DetailsTypeEventsPage";
import EditTypeEventsPage from "../pages/contracts/typesEvents/EditTypeEventsPage";
import DetailsContractPage from "../pages/contracts/contract/DetailsContractPage";
import EditContractPage from "../pages/contracts/contract/EditContractPage";
import CreateEventContractPage from "../pages/contracts/contract/events/CreateEventContractPage";
import HistoryEventsContractPage from "../pages/contracts/contract/events/HistoryEventsContractPage";
import EditEventContractPage from "../pages/contracts/contract/events/EditEventContractPage";
import OsItemTypePage from "../pages/contracts/OsItemType/OsItemTypePage";
import CreateOsItemTypePage from "../pages/contracts/OsItemType/CreateOsItemTypePage";
import EditOsItemTypePage from "../pages/contracts/OsItemType/EditOsItemTypePage";
import EditStatusContractPage from "../pages/contracts/status/EditStatusContractPage";
import NotFound from "../pages/NotFound";
import OsDepartamentsPage from "../pages/contracts/osDepartaments/OsDepartamentsPage";
import CreateOsDepartamentsPage from "../pages/contracts/osDepartaments/CreateOsDepartamentsPage";
import EditOsDepartamentsPage from "../pages/contracts/osDepartaments/EditOsDepartamentsPage";
import OsDestinationsPage from "../pages/contracts/osDestinations/OsDestinationsPage";
import CreateOsDestinationsPage from "../pages/contracts/osDestinations/CreateOsDestinationsPage";
import EditOsDestinationsPage from "../pages/contracts/osDestinations/EditOsDestinationsPage";
import OsStatusPage from "../pages/contracts/osStatus/osStatusPage";
import CreateOsStatusPage from "../pages/contracts/osStatus/CreateOsStatusPage";
import EditOsStatusPage from "../pages/contracts/osStatus/EditOsStatusPage";
import ContractOsPage from "../pages/contracts/contract/orderService/ContractOsPage";
import CreateContractOsPage from "../pages/contracts/contract/orderService/CreateContractOsPage";
import EditContractOsPage from "../pages/contracts/contract/orderService/EditContractOsPage";
import DetailsContractOsPage from "../pages/contracts/contract/orderService/DetailsContractOsPage";
import DetailsContractOsItensPage from "../pages/contracts/contract/orderService/itensOs/DetailsContractOsItensPage";
import EditContractOsItemPage from "../pages/contracts/contract/orderService/itensOs/EditContractOsItemPage";
import CreateContractOsItemPage from "../pages/contracts/contract/orderService/itensOs/CreateContractOsItemPage";
import MovementsPage from "../pages/Movements/MovementsPage";
import CreateMovementPage from "../pages/Movements/CreateMovementPage";
import EditMovementPage from "../pages/Movements/EditMovementPage";
import DetailsMovementPage from "../pages/Movements/DetailsMovementPage";
import CreateMovementItemPage from "../pages/Movements/Items/CreateMovementItemPage";
import EditMovementItemPage from "../pages/Movements/Items/EditMovementItemPage";
import DetailsMovementItemPage from "../pages/Movements/Items/DetailsMovementItemPage";
import MovementsShipmentsPage from "../pages/Movements/shipments/MovementsShipmentsPage";
import CreateMovementsShipmentsPage from "../pages/Movements/shipments/CreateMovementsShipmentsPage";
import EditMovementsShipmentsPage from "../pages/Movements/shipments/EditMovementsShipmentsPage";
import DetailsMovementsShipmentsPage from "../pages/Movements/shipments/DetailsMovementsShipmentsPage";
import CreateShipmentItemPage from "../pages/Movements/shipments/items/CreateShipmentItemPage";
import EditShipmentItemPage from "../pages/Movements/shipments/items/EditShipmentItemPage";
import DetailsShipmentItemPage from "../pages/Movements/shipments/items/DetailsShipmentItemPage";
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
        {
            path: "/usuarios/organizacoes/:id",
            element: <PrivateRoute element={UserOrganizationsPage} />,
        },
    ];

    const organizationRoutes = [
        {
            path: "/orgaos",
            element: <PrivateRoute element={CompanySelection} />,
        },
        {
            path: "/organizacoes/dashboard",
            element: <PrivateRoute element={OrganizationPage} />,
        },
        {
            path: "/organizacoes/criar/",
            element: <PrivateRoute element={CreateOrganizationPage} />,
        },
        {
            path: "/organizacoes/editar/:organizationId",
            element: <PrivateRoute element={EditOrganizationPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId",
            element: <PrivateRoute element={OrganizationDetailsPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/adicionar",
            element: <PrivateRoute element={CreateOrganizationAddressPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/editar/:addressId",
            element: <PrivateRoute element={EditOrganizationAddressPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/detalhes/:addressId",
            element: <PrivateRoute element={OrganizationAddressDetailsPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/:addressId/localizacoes",
            element: <PrivateRoute element={LocationOrganizationPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/:addressId/localizacoes/adicionar",
            element: <PrivateRoute element={CreateOrganizationLocationPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/:addressId/localizacoes/editar/:locationId",
            element: <PrivateRoute element={EditOrganizationLocationPage} />,
        },
        {
            path: "/organizacoes/detalhes/:organizationId/enderecos/:addressId/localizacoes/detalhes/:locationId",
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
        },
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
            path: "/tipos/:id/grupos/associar",
            element: <PrivateRoute element={AttachGroupToTypePage}/>
        }
    ];

    const typesEventsRoutes = [
        {
            path: "/contratos/tipos-eventos",
            element: <PrivateRoute element={TypeEventsPage} />,
        },
        {
            path: "/contratos/tipos-eventos/detalhes/:id",
            element: <PrivateRoute element={DetailsTypeEventsPage} />,
        },
        {
            path: "/contratos/tipos-eventos/criar",
            element: <PrivateRoute element={CreateTypeEventsPage} />,
        },
        {
            path: "/contratos/tipos-eventos/editar/:id",
            element: <PrivateRoute element={EditTypeEventsPage}/>
        }
    ];


    const contractRoutes = [
        {
            path: "/contratos",
            element: <PrivateRoute element={ContractPage} />,
        },
        {
            path: "/contratos/criar",
            element: <PrivateRoute element={CreateContractPage} />,
        },
        {
            path: "/contratos/editar/:id",
            element: <PrivateRoute element={EditContractPage}/>
        },
        {
            path: "/contratos/detalhes/:id",
            element: <PrivateRoute element={DetailsContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/adicionar/",
            element: <PrivateRoute element={CreateEventContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/historico/",
            element: <PrivateRoute element={HistoryEventsContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/editar/",
            element: <PrivateRoute element={EditEventContractPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/",
            element: <PrivateRoute element={ContractOsPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/criar",
            element: <PrivateRoute element={CreateContractOsPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/editar/:contractOsId",
            element: <PrivateRoute element={EditContractOsPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/detalhes/:contractOsId",
            element: <PrivateRoute element={DetailsContractOsPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/detalhes/:contractOsId/itens/detalhes/:contractOsItemId",
            element: <PrivateRoute element={DetailsContractOsItensPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/detalhes/:contractOsId/itens/editar/:contractOsItemId",
            element: <PrivateRoute element={EditContractOsItemPage}/>
        },
        {
            path: "/contratos/:id/ordens-servicos/detalhes/:contractOsId/itens/criar/",
            element: <PrivateRoute element={CreateContractOsItemPage}/>
        }
    ];


    const typesContractRoutes = [
        {
            path: "/contratos/tipos",
            element: <PrivateRoute element={TypeContractPage} />,
        },
        {
            path: "/contratos/tipos/criar",
            element: <PrivateRoute element={CreateTypeContractPage} />,
        },
        {
            path: "/contratos/tipos/editar/:id",
            element: <PrivateRoute element={EditTypeContractPage}/>
        }
    ];

    const OsItemTypeRoutes = [
        {
            path: "/contratos/ordem-servico/tipos-itens",
            element: <PrivateRoute element={OsItemTypePage} />,
        },
        {
            path: "/contratos/ordem-servico/tipos-itens/criar",
            element: <PrivateRoute element={CreateOsItemTypePage} />,
        },
        {
            path: "/contratos/ordem-servico/tipos-itens/editar/:id",
            element: <PrivateRoute element={EditOsItemTypePage}/>
        }
    ];

    const OsDepartamentsRoutes = [
        {
            path: "/contratos/ordem-servico/departamentos",
            element: <PrivateRoute element={OsDepartamentsPage} />,
        },
        {
            path: "/contratos/ordem-servico/departamentos/criar",
            element: <PrivateRoute element={CreateOsDepartamentsPage} />,
        },
        {
            path: "/contratos/ordem-servico/departamentos/editar/:id",
            element: <PrivateRoute element={EditOsDepartamentsPage}/>
        }
    ];

    const OsDestinationsRoutes = [
        {
            path: "/contratos/ordem-servico/destinos",
            element: <PrivateRoute element={OsDestinationsPage} />,
        },
        {
            path: "/contratos/ordem-servico/destinos/criar",
            element: <PrivateRoute element={CreateOsDestinationsPage} />,
        },
        {
            path: "/contratos/ordem-servico/destinos/editar/:id",
            element: <PrivateRoute element={EditOsDestinationsPage}/>
        }
    ];

    const OsStatusRoutes = [
        {
            path: "/contratos/ordem-servico/status",
            element: <PrivateRoute element={OsStatusPage} />,
        },
        {
            path: "/contratos/ordem-servico/status/criar",
            element: <PrivateRoute element={CreateOsStatusPage} />,
        },
        {
            path: "/contratos/ordem-servico/status/editar/:id",
            element: <PrivateRoute element={EditOsStatusPage}/>
        }
    ];

    const OrdersServicesRoutes = [
    ];


    const statusContractRoutes = [
        {
            path: "/contratos/status",
            element: <PrivateRoute element={StatusContractPage} />,
        },
        {
            path: "/contratos/status/criar",
            element: <PrivateRoute element={CreateStatusContractPage} />,
        },
        {
            path: "/contratos/status/editar/:id",
            element: <PrivateRoute element={EditStatusContractPage}/>
        },
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
            path: "/produtos/editar/:id",
            element: <PrivateRoute element={EditProductPage}/>
        },
        {
            path: "/produtos/detalhes/:id",
            element: <PrivateRoute element={DetailsProductPage}/>
        }
    ];

    const movementsRoutes = [
        {
            path: "/movimentos",
            element: <PrivateRoute element={MovementsPage} />,
        },
        {
            path: "/movimentos/criar",
            element: <PrivateRoute element={CreateMovementPage} />,
        },
        {
            path: "/movimentos/editar/:id",
            element: <PrivateRoute element={EditMovementPage}/>
        },
        {
            path: "/movimentos/detalhes/:id",
            element: <PrivateRoute element={DetailsMovementPage}/>
        },
        {
            path: "/movimentos/detalhes/:id/produtos/adicionar/:orderServiceId",
            element: <PrivateRoute element={CreateMovementItemPage}/>
        },
        {
            path: "/movimentos/detalhes/:id/produtos/editar/:movementProductId/:orderServiceId",
            element: <PrivateRoute element={EditMovementItemPage}/>
        },
        {
            path: "/movimentos/detalhes/:id/produtos/detalhes/:movementProductId/",
            element: <PrivateRoute element={DetailsMovementItemPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/",
            element: <PrivateRoute element={MovementsShipmentsPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/criar",
            element: <PrivateRoute element={CreateMovementsShipmentsPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/:shipmentId/editar",
            element: <PrivateRoute element={EditMovementsShipmentsPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/:shipmentId/detalhes",
            element: <PrivateRoute element={DetailsMovementsShipmentsPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/:shipmentId/itens/adicionar",
            element: <PrivateRoute element={CreateShipmentItemPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/:shipmentId/itens/:shipmentItemId/editar",
            element: <PrivateRoute element={EditShipmentItemPage}/>
        },
        {
            path: "/movimentos/:id/carregamentos/:shipmentId/itens/:shipmentItemId/detalhes",
            element: <PrivateRoute element={DetailsShipmentItemPage}/>
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

    const costumersRoutes = [
        {
            path: "/clientes",
            element: <PrivateRoute element={CostumerPage} />,
        },
        {
            path: "/clientes/criar",
            element: <PrivateRoute element={CreateCustomerPage} />,
        },
        {
            path: "/clientes/editar/:id",
            element: <PrivateRoute element={EditCustomerPage}/>
        },
        {
            path: "/clientes/detalhes/:id",
            element: <PrivateRoute element={CustomerDetailsPage}/>
        },
        {
            path: "/clientes/:id/endereco/editar/:addressId",
            element: <PrivateRoute element={EditCustomerAddressPage}/>
        },
        {
            path: "/clientes/:id/endereco/:addressId/detalhes",
            element: <PrivateRoute element={CostumerAddressDetailsPage}/>
        },
        {
            path: "/clientes/:id/endereco/adicionar",
            element: <PrivateRoute element={CreateCustomerAddressPage}/>
        },
        {
            path: "/clientes/:id/contato/adicionar",
            element: <PrivateRoute element={CreateCustomerContactPage}/>
        },
        {
            path: "/clientes/:id/contato/editar/:contactId",
            element: <PrivateRoute element={EditCustomerContactPage}/>
        },
        {
            path: "/clientes/detalhes/:id/enderecos/:addressId/localizacoes",
            element: <PrivateRoute element={LocationCustomerPage} />,
        },
        {
            path: "/clientes/detalhes/:id/enderecos/:addressId/localizacoes/adicionar",
            element: <PrivateRoute element={CreateCustomerLocationPage} />,
        },
        {
            path: "/clientes/detalhes/:id/enderecos/:addressId/localizacoes/editar/:locationId",
            element: <PrivateRoute element={EditCustomerLocationPage} />,
        },
        {
            path: "/clientes/detalhes/:id/enderecos/:addressId/localizacoes/detalhes/:locationId",
            element: <PrivateRoute element={DetailsCustomerLocationPage} />,
        },


    ];
    
    const calendarRoutes = [
        {
            path: "/calendario",
            element: <PrivateRoute element={CalendarPage} />,
        },
    ];

    return (

        <Routes location={location}>
            <Route path="*" element={<NotFound/>}/> {/* Página 404 */}

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

        {contractRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {movementsRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {typesContractRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {OsItemTypeRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {OsDepartamentsRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {OsDestinationsRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}
    
        {OsStatusRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {OrdersServicesRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}
        
        {statusContractRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}
        
        {typesEventsRoutes.map((route, index) => (
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

        {costumersRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {calendarRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}
        
        </Routes>
    );
};

export default AppRoutesContent;
