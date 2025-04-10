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
import UsersPage from "../pages/users/user/UsersPage";
import CreateUserPage from "../pages/users/user/CreateUserPage";
import EditUserPage from "../pages/users/user/EditUserPage";
import PerfilUserPage from "../pages/users/user/PerfilUserPage";
import UserOrganizationsPage from "../pages/users/user/organizations/UserOrganizationsPage";

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
import SuppliersPage from "../pages/products/suppliers/SuppliersPage";
import CreateSupplierPage from "../pages/products/suppliers/CreateSupplierPage";
import EditSupplierPage from "../pages/products/suppliers/EditSupplierPage";
import SupplierDetailsPage from "../pages/products/suppliers/SupplierDetailsPage";
import EditSupplierAddressPage from "../pages/products/suppliers/address/EditSupplierAddressPage";
import SupplierAddressDetailsPage from "../pages/products/suppliers/address/SupplierAddressDetailsPage";
import CreateSupplierAddressPage from "../pages/products/suppliers/address/CreateSupplierAddressPage";
import CreateSupplierContactPage from "../pages/products/suppliers/contact/CreateSupplierContactPage";
import EditSupplierContactPage from "../pages/products/suppliers/contact/EditSupplierContactPage";
// Páginas de Tipos
import TypePage from "../pages/products/types/TypePage";
import CreateTypePage from "../pages/products/types/CreateTypePage";
import EditTypePage from "../pages/products/types/EditTypePage";

// Páginas de Categorias
import CategoryPage from "../pages/categories/CategoryPage";
import CreateCategoryPage from "../pages/categories/CreateCategoryPage";
import EditCategoryPage from "../pages/categories/EditCategoryPage";

// Páginas de Condições
import ConditionPage from "../pages/conditions/ConditionPage";
import CreateConditionPage from "../pages/conditions/CreateConditionPage";
import EditConditionPage from "../pages/conditions/EditConditionPage";

// Páginas de Grupos
import GroupPage from "../pages/products/groups/GroupPage";
import CreateGroupPage from "../pages/products/groups/CreateGroupPage";
import EditGroupPage from "../pages/products/groups/EditGroupPage";
import AttachGroupToTypePage from "../pages/products/types/groups/AttachGroupToTypePage";


// Páginas de Unidades
import UnitPage from "../pages/products/units/UnitPage";
import CreateUnitPage from "../pages/products/units/CreateUnitPage";
import EditUnitPage from "../pages/products/units/EditUnitPage";
import AttachUnitsRelatedPage from "../pages/products/units/unitsRelated/AttachUnitsRelatedPage";

// Páginas de Produtos
import ProductsPage from "../pages/products/product/ProductPage";
import CreateProductPage from "../pages/products/product/CreateProductPage";
import EditProductPage from "../pages/products/product/EditProductPage";
import DetailsProductPage from "../pages/products/product/DetailsProductPage";

// Páginas de Organizações - Detalhes e Localizações
import OrganizationDetailsPage from "../pages/organization/OrganizationDetailsPage";
import CreateOrganizationAddressPage from "../pages/organization/address/CreateOrganizationAddressPage";
import EditOrganizationAddressPage from "../pages/organization/address/EditOrganizationAddressPage";
import OrganizationAddressDetailsPage from "../pages/organization/address/OrganizationAddressDetailsPage";
import LocationOrganizationPage from "../pages/organization/locations/LocationOrganizationPage";
import CreateOrganizationLocationPage from "../pages/organization/locations/CreateOrganizationLocationPage";
import EditOrganizationLocationPage from "../pages/organization/locations/EditOrganizationLocationPage";
import DetailsOrganizationLocationPage from "../pages/organization/locations/DetailsOrganizationLocationPage";


// Páginas de Clientes
import CostumerPage from "../pages/users/costumer/CostumerPage";
import CreateCustomerPage from "../pages/users/costumer/CreateCostumerPage";
import EditCustomerPage from "../pages/users/costumer/EditCustomerPage";
import CustomerDetailsPage from "../pages/users/costumer/CustomerDetailsPage";
import CostumerAddressDetailsPage from "../pages/users/costumer/address/CostumerAddressDetailsPage";
import EditCustomerAddressPage from "../pages/users/costumer/address/EditCustomerAddressPage";
import EditCustomerContactPage from "../pages/users/costumer/contact/EditCustomerContactPage";
import CreateCustomerContactPage from "../pages/users/costumer/contact/CreateCustomerContactPage";
import CreateCustomerAddressPage from "../pages/users/costumer/address/CreateCustomerAddressPage";
import LocationCustomerPage from "../pages/users/costumer/locations/LocationCustomerPage";
import CreateCustomerLocationPage from "../pages/users/costumer/locations/CreateCustomerLocationPage";
import EditCustomerLocationPage from "../pages/users/costumer/locations/EditCustomerLocationPage";
import DetailsCustomerLocationPage from "../pages/users/costumer/locations/DetailsOrganizationLocationPage";

// Páginas de Contratos e Status
import CalendarPage from "../pages/contracts/CalendarPage";
import TypeContractPage from "../pages/contracts/typesContracts/TypeContractPage";
import CreateTypeContractPage from "../pages/contracts/typesContracts/CreateTypeContractPage";
import EditTypeContractPage from "../pages/contracts/typesContracts/EditTypeContractPage";
import StatusContractPage from "../pages/contracts/status/StatusContractPage";
import CreateStatusContractPage from "../pages/contracts/status/CreateStatusContractPage";
import EditStatusContractPage from "../pages/contracts/status/EditStatusContractPage";
import ContractPage from "../pages/contracts/contract/ContractPage";
import CreateContractPage from "../pages/contracts/contract/CreateContractPage";
import EditContractPage from "../pages/contracts/contract/EditContractPage";
import DetailsContractPage from "../pages/contracts/contract/DetailsContractPage";

// Páginas de Eventos de Contratos
import TypeEventsPage from "../pages/events/typesEvents/TypeEventsPage";
import CreateTypeEventsPage from "../pages/events/typesEvents/CreateTypeEventsPage";
import EditTypeEventsPage from "../pages/events/typesEvents/EditTypeEventsPage";
import DetailsTypeEventsPage from "../pages/events/typesEvents/DetailsTypeEventsPage";

// Páginas de Ordens de Serviço
import OsDepartamentsPage from "../pages/orderService/osDepartaments/OsDepartamentsPage";
import CreateOsDepartamentsPage from "../pages/orderService/osDepartaments/CreateOsDepartamentsPage";
import EditOsDepartamentsPage from "../pages/orderService/osDepartaments/EditOsDepartamentsPage";
import OsDestinationsPage from "../pages/orderService/osDestinations/OsDestinationsPage";
import CreateOsDestinationsPage from "../pages/orderService/osDestinations/CreateOsDestinationsPage";
import EditOsDestinationsPage from "../pages/orderService/osDestinations/EditOsDestinationsPage";
import OsStatusPage from "../pages/orderService/osStatus/osStatusPage";
import CreateOsStatusPage from "../pages/orderService/osStatus/CreateOsStatusPage";
import EditOsStatusPage from "../pages/orderService/osStatus/EditOsStatusPage";

// Páginas de Contratos de OS
import ContractOsPage from "../pages/contracts/contract/orderService/ContractOsPage";
import CreateContractOsPage from "../pages/contracts/contract/orderService/CreateContractOsPage";
import EditContractOsPage from "../pages/contracts/contract/orderService/EditContractOsPage";
import DetailsContractOsPage from "../pages/contracts/contract/orderService/DetailsContractOsPage";
import DetailsContractOsItensPage from "../pages/contracts/contract/orderService/itensOs/DetailsContractOsItensPage";
import EditContractOsItemPage from "../pages/contracts/contract/orderService/itensOs/EditContractOsItemPage";
import CreateContractOsItemPage from "../pages/contracts/contract/orderService/itensOs/CreateContractOsItemPage";

// Páginas de Movimentos
import MovementsPage from "../pages/Movements/Movement/MovementsPage";
import CreateMovementPage from "../pages/Movements/Movement/CreateMovementPage";
import EditMovementPage from "../pages/Movements/Movement/EditMovementPage";
import DetailsMovementPage from "../pages/Movements/Movement/DetailsMovementPage";
import CreateMovementItemPage from "../pages/Movements/Movement/Items/CreateMovementItemPage";
import EditMovementItemPage from "../pages/Movements/Movement/Items/EditMovementItemPage";
import DetailsMovementItemPage from "../pages/Movements/Movement/Items/DetailsMovementItemPage";

// Páginas de Movimentos de Carregamentos
import MovementsShipmentsPage from "../pages/Movements/Movement/shipments/MovementsShipmentsPage";
import CreateMovementsShipmentsPage from "../pages/Movements/Movement/shipments/CreateMovementsShipmentsPage";
import EditMovementsShipmentsPage from "../pages/Movements/Movement/shipments/EditMovementsShipmentsPage";
import DetailsMovementsShipmentsPage from "../pages/Movements/Movement/shipments/DetailsMovementsShipmentsPage";
import CreateShipmentItemPage from "../pages/Movements/Movement/shipments/items/CreateShipmentItemPage";
import EditShipmentItemPage from "../pages/Movements/Movement/shipments/items/EditShipmentItemPage";
import DetailsShipmentItemPage from "../pages/Movements/Movement/shipments/items/DetailsShipmentItemPage";

// Páginas de Envio de Produtos
import OrdersServicesPage from "../pages/orderService/OrderService/OrdersServicesPage";
import DetailsOrderServicesPage from "../pages/orderService/OrderService/DetailsOrderServicesPage";
import DetailsItemOrderServicePage from "../pages/orderService/OrderService/items/DetailsItemOrderServicePage";

// Páginas de Envios
import ShipmentsPage from "../pages/Movements/shipments/ShipmentsPage";
import DetailsShipmentsPage from "../pages/Movements/shipments/DetailsShipmentsPage";
import DetailsShipmentItemGlobalPage from "../pages/Movements/shipments/items/DetailsShipmentItemGlobalPage";

// Páginas de Tipos de Movimentos
import MovementsTypesPage from "../pages/Movements/MovementsTypes/MovementsTypesPage";

// Páginas de Eventos
import DetailsEventContractPage from "../pages/events/event/DetailsEventContractPage";
import CreateEventItemContractPage from "../pages/events/event/items/CreateEventItemContractPage";
import EditEventItemContractPage from "../pages/events/event/items/EditEventItemContractPage";
import CreateEventJobContractPage from "../pages/events/event/jobs/CreateEventJobContractPage";
import EditEventJobContractPage from "../pages/events/event/jobs/EditEventJobContractPage";
import HistoryEventsContractPage from "../pages/events/event/HistoryEventsContractPage"
import EditEventContractPage from "../pages/events/event/EditEventContractPage";

import CreateEventContractPage from "../pages/events/event/CreateEventContractPage"
import NotFound from "../pages/NotFound";
import KitPage from "../pages/products/kits/KitPage";
import CreateKitPage from "../pages/products/kits/CreateKitPage";
import EditKitPage from "../pages/products/kits/EditKitPage";
import KitItemsPage from "../pages/products/kits/items/KitItemsPage";
import EditKitItemPage from "../pages/products/kits/items/EditKitItemPage";
import CreateKitItemPage from "../pages/products/kits/items/CreateKitItemPage";

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

    const kitsRoutes = [
        {
            path: "/kits",
            element: <PrivateRoute element={KitPage} />,
        },
        {
            path: "/kits/criar",
            element: <PrivateRoute element={CreateKitPage} />,
        },
        {
            path: "/kits/editar/:id",
            element: <PrivateRoute element={EditKitPage}/>
        },
        {
            path: "/kits/:id/itens",
            element: <PrivateRoute element={KitItemsPage}/>
        },
        {
            path: "/kits/:id/itens/criar",
            element: <PrivateRoute element={CreateKitItemPage}/>
        },
        {
            path: "/kits/:id/itens/:itemKitId/editar",
            element: <PrivateRoute element={EditKitItemPage}/>
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
            path: "/contratos/:id/eventos/:eventId/detalhes/",
            element: <PrivateRoute element={DetailsEventContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/detalhes/",
            element: <PrivateRoute element={DetailsEventContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/itens/adicionar/",
            element: <PrivateRoute element={CreateEventItemContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/itens/editar/:eventItemId",
            element: <PrivateRoute element={EditEventItemContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/servicos/adicionar/",
            element: <PrivateRoute element={CreateEventJobContractPage}/>
        },
        {
            path: "/contratos/:id/eventos/:eventId/servicos/editar/:eventJobId",
            element: <PrivateRoute element={EditEventJobContractPage}/>
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

    const movementTypesRoutes = [
        {
            path: "/movimentos/tipos",
            element: <PrivateRoute element={MovementsTypesPage} />,
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
        {
            path: "/ordens-servicos",
            element: <PrivateRoute element={OrdersServicesPage} />,
        },
        {
            path: "/ordens-servicos/:id/detalhes/",
            element: <PrivateRoute element={DetailsOrderServicesPage}/>
        },
        {
            path: "/ordens-servicos/:id/detalhes/itens/:osItemId",
            element: <PrivateRoute element={DetailsItemOrderServicePage}/>
        }
    ];

    const shipmentsRoutes = [
        {
            path: "/carregamentos",
            element: <PrivateRoute element={ShipmentsPage} />,
        },
        {
            path: "/carregamentos/:id/detalhes/",
            element: <PrivateRoute element={DetailsShipmentsPage}/>
        },
        {
            path: "/carregamentos/:id/detalhes/itens/:shipmentItemId/detalhes",
            element: <PrivateRoute element={DetailsShipmentItemGlobalPage}/>
        }
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

        {kitsRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}
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

        {shipmentsRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {typesContractRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
        ))}

        {movementTypesRoutes.map((route, index) => (
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
