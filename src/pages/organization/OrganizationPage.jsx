import React, { useState, useEffect } from 'react';
import { faEdit, faTrashAlt, faBuilding, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/DynamicTable';
import ConfirmationModal from '../../components/modals/ConfirmationModal'; 
import '../../assets/styles/custom-styles.css';
import MainLayout from '../../layouts/MainLayout';  
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import FilterForm from '../../components/FilterForm';
import useOrganizationFilters from '../../hooks/filters/useOrganizationFilters';
import PageHeader from '../../components/PageHeader';
import ListHeader from '../../components/ListHeader';
import useAction from '../../hooks/useAction';

const OrganizationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll } = useBaseService(navigate);
    const [organizations, setOrganizations] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message);
        }
    }, [location.state, showNotification]);

    const fetchOrganizations = async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.organizations.get, filtersSubmit || filters);
            
            const filteredOrganizations = response.result.data.map(org => ({
                id: org.id,
                name: org.name,
                color: org.color,
                deleted_at: org.deleted_at ? 'deleted-' + org.deleted_at : 'deleted-null'
            }));
            
            setOrganizations(filteredOrganizations);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useOrganizationFilters(fetchOrganizations, filters, setFilters);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const headers = ['id', 'Nome', 'Cor'];

    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar organização',
            buttonClass: 'btn-primary',
            permission: 'Atualizar organizações',
            onClick: (organization) => navigate(`/organizacoes/editar/${organization.id}`) 
        },
        {
            id: 'viewDetails',
            icon: faBuilding,
            title: 'Ver detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver organizações',
            onClick: (organization) => navigate(`/organizacoes/detalhes/${organization.id}`) 
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir organização',
            buttonClass: 'btn-danger',
            permission: 'Excluir organizações',
            onClick: (organization) => handleDelete(organization, 'Você tem certeza que deseja excluir: ', entities.organizations.delete(organization.id), fetchOrganizations)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar organização',
            buttonClass: 'btn-info',
            permission: 'Atualizar organizações',
            onClick: (organization) => handleActivate(organization, 'Você tem certeza que deseja ativar: ', fetchOrganizations)
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Organizações" showBackButton={true} backUrl="/dashboard" /> 

            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de organizações" 
                    buttonText="Nova organização" 
                    buttonLink="/organizacoes/criar" 
                    canAccess={canAccess} 
                    permission="Criar organizações"
                />

                <DynamicTable 
                    headers={headers} 
                    data={organizations} 
                    actions={actions} 
                    currentPage={currentPage} 
                    totalPages={totalPages}
                    onPageChange={fetchOrganizations}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={handleConfirmAction}
                    itemName={selectedItem ? selectedItem.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default OrganizationPage;
