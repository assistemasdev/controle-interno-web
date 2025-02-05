import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../../layouts/MainLayout";
import DynamicTable from "../../../components/DynamicTable";
import { usePermissions } from "../../../hooks/usePermissions";
import { useNavigate, useParams } from "react-router-dom";
import { faEdit, faEye, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import useBaseService from "../../../hooks/services/useBaseService";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import { PAGINATION } from "../../../constants/pagination";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader"; 
import useAction from "../../../hooks/useAction"; 

const LocationOrganizationPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { organizationId, addressId } = useParams();
    const { get: fetchAll } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [locations, setLocations] = useState([]);
    const { 
        openModalConfirmation,
        action,
        handleActivate,
        handleDelete,
        handleConfirmAction,
        handleCancelConfirmation,
        selectedItem,
    } = useAction(navigate); 

    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [filters, setFilters] = useState({
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage
    });

    const fetchLocations = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.organizations.addresses.locations(organizationId).get(addressId), filtersSubmit || filters);
            const { result, last_page, current_page } = response;

            const formattedLocations = result.data.map((loc) => ({
                id: loc.id || '-',
                area: loc.area || '-',
                section: loc.section || '-',
                spot: loc.spot || '-',
                deleted_at: loc.deleted_at ? 'deleted-' + loc.deleted_at : 'deleted-null'
            }));

            setLocations(formattedLocations);
            setTotalPages(last_page);
            setCurrentPage(current_page);
        } catch (error) {
            showNotification("error", "Erro ao carregar localizações");
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [fetchAll, organizationId, addressId, itemsPerPage, currentPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchLocations();
    }, [organizationId, addressId]);

    const headers = ["id", "Área", "Seção", "Ponto"];

    const actions = [
        {
            icon: faEdit,
            title: "Editar Localização",
            buttonClass: "btn-primary",
            permission: "Atualizar endereço da organização",
            onClick: (location) => navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes/editar/${location.id}`),
        },
        {
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver endereços de organizações",
            onClick: (location) => navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes/detalhes/${location.id}`),
        },
        {
            icon: faTrash,
            title: "Excluir Localização",
            buttonClass: "btn-danger",
            permission: "Excluir endereço da organização",
            onClick: (location) => handleDelete(location, "Excluir Localização", entities.organizations.addresses.locations(organizationId).delete(addressId, location.id), fetchLocations), // Usando o handleDelete
        },
        {
            icon: faUndo, 
            title: "Ativar Localização",
            buttonClass: "btn-info", 
            permission: "Ativar localização da organização", 
            onClick: (location) => handleActivate(location, "Ativar Localização", fetchLocations),
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <PageHeader 
                    title="Localizações da Organização" 
                    showBackButton={true} 
                    backUrl={`/organizacoes/detalhes/${organizationId}/`} 
                />

                <ListHeader 
                    title="Lista de Localizações" 
                    buttonText="Nova Localização"
                    buttonLink={`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes/adicionar`}
                    canAccess={canAccess} 
                    permission="Adicionar endereço à organização"
                />

                <DynamicTable
                    headers={headers}
                    data={locations}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchLocations}
                    setFilters={setFilters}
                    filters={filters}
                />
                
            </div>

            <ConfirmationModal
                open={openModalConfirmation}
                onClose={handleCancelConfirmation}
                onConfirm={handleConfirmAction}
                itemName={selectedItem ? selectedItem.area : ""}
                action={action.text}
            />
        </MainLayout>
    );
};

export default LocationOrganizationPage;
