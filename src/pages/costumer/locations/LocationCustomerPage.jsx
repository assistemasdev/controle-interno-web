import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faEye, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";
import PageHeader from "../../../components/PageHeader";
import ListHeader from "../../../components/ListHeader";
import useAction from "../../../hooks/useAction";
import useLocationFilters from "../../../hooks/filters/useLocationFilters";
import FilterForm from "../../../components/FilterForm";

const LocationCustomerPage = () => {
    const { canAccess } = usePermissions();
    const { id, addressId } = useParams();
    const [name, setName] = useState('');
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { openModalConfirmation, action, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem } = useAction(navigate); 
    const [filters, setFilters] = useState({
        id: '',
        area: '',
        idLike: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    const fetchLocations = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.customers.addresses.locations(id).get(addressId), filtersSubmit || filters);

            const formattedLocations = response.result.data.map((loc) => ({
                id: loc.id || '-',
                area: loc.area || '-',
                section: loc.section || '-',
                spot: loc.spot || '-',
                deleted_at: loc.deleted_at ? 'deleted-' + loc.deleted_at : 'deleted-null'
            }));

            setLocations(formattedLocations);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            showNotification("error", "Erro ao carregar localizações");
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, itemsPerPage, fetchAll, showLoader, hideLoader, showNotification]);

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useLocationFilters(fetchLocations, filters, setFilters);  

    useEffect(() => {
        fetchLocations();
    }, [id, addressId]);

    const headers = useMemo(() => ["id", "Área", "Seção", "Ponto"], []);

    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: "Editar",
            buttonClass: "btn-primary",
            permission: "Atualizar endereço da cliente",
            onClick: (location) => navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/editar/${location.id}`),
        },
        {
            id: 'viewDetails',
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver endereços de clientes",
            onClick: (location) => navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/detalhes/${location.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir clientes',
            onClick: (location) => handleDelete(location, 'Você tem certeza que deseja excluir: ', entities.customers.addresses.locations(id).delete(addressId, location.id), fetchLocations),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: '',
            onClick: (location) => handleActivate(location, 'Você tem certeza que deseja ativar: '),
        },
    ], [handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Localizações do Cliente" showBackButton={true} backUrl={`/clientes/detalhes/${id}`} />
            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader
                    title='Lista de Localizações'
                    buttonText="Nova Localização"
                    buttonLink={`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/adicionar`}
                    canAccess={canAccess}
                    permission="Adicionar localização ao cliente"
                />

                <DynamicTable 
                    headers={headers} 
                    data={locations} 
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchLocations}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>

            <ConfirmationModal
                open={openModalConfirmation}
                onClose={handleCancelConfirmation}
                onConfirm={handleConfirmAction}
                itemName={selectedItem ? `${selectedItem.id} - ${selectedItem.area}` : ''}
                text={action.text}
            />
        </MainLayout>
    );
};

export default LocationCustomerPage;
