import React, { useState, useEffect } from 'react';
import { faEdit, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
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
import useApplicationFilters from '../../hooks/filters/useApplicationFilters'; 
import PageHeader from '../../components/PageHeader';
import ListHeader from '../../components/ListHeader';
import useAction from '../../hooks/useAction';

const ApplicationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { openModalConfirmation, handleActivate, handleDelete, handleConfirmAction, handleCancelConfirmation, selectedItem, action } = useAction(navigate);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        session_code: '',
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification('error', location.state.message);
        }
    }, [location.state, showNotification]);

    const fetchApplications = async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.applications.get, filtersSubmit || filters);

            const filteredApplications = response.result.data.map(application => ({
                id: application.id,
                name: application.name,
                sessionCode: application.session_code,
                deleted_at: application.deleted_at ? 'deleted-' + application.deleted_at : 'deleted-null'
            }));

            setApplications(filteredApplications);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const { handleFilterSubmit, handleClearFilters, inputsfilters } = useApplicationFilters(fetchApplications, filters, setFilters);

    useEffect(() => {
        fetchApplications();
    }, []);

    const headers = ['id', 'Nome', 'Código de Sessão'];

    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar aplicação',
            buttonClass: 'btn-primary',
            permission: 'Atualizar aplicações',
            onClick: (application) => navigate(`/aplicacoes/editar/${application.id}`)
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir aplicação',
            buttonClass: 'btn-danger',
            permission: 'Excluir aplicações',
            onClick: (application) => handleDelete(application, 'Você tem certeza que deseja excluir: ', entities.applications.delete(application.id), fetchApplications)
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar aplicação',
            buttonClass: 'btn-info',
            permission: 'Atualizar aplicações',
            onClick: (application) => handleActivate(application, 'Você tem certeza que deseja ativar: ', fetchApplications)
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Aplicações" showBackButton={true} backUrl="/dashboard" />

            <div className="container-fluid p-1">
                <FilterForm autoCompleteFields={inputsfilters} onSubmit={handleFilterSubmit} onClear={handleClearFilters} />

                <ListHeader 
                    title="Lista de Aplicações" 
                    buttonText="Nova Aplicação" 
                    buttonLink="/aplicacoes/criar" 
                    canAccess={canAccess} 
                    permission="Criar aplicações"
                />

                <DynamicTable
                    headers={headers}
                    data={applications}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchApplications}
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

export default ApplicationPage;
