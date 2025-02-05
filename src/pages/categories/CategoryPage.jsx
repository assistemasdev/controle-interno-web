import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import baseService from "../../services/baseService";
import { entities } from "../../constants/entities";
import { PAGINATION } from "../../constants/pagination";
import useAction from "../../hooks/useAction";
import PageHeader from "../../components/PageHeader";
import ListHeader from "../../components/ListHeader";
import FilterForm from "../../components/FilterForm";
import useCategoryFilters from "../../hooks/filters/useCategoryFilters"; 
import ConfirmationModal from '../../components/modals/ConfirmationModal';

const CategoryPage = () => {
    const { canAccess } = usePermissions();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage: itemsPerPage,
    });

    const { 
        openModalConfirmation, 
        setOpenModalConfirmation, 
        action, 
        handleActivate, 
        handleDelete, 
        handleConfirmAction, 
        handleCancelConfirmation, 
        selectedItem
    } = useAction(navigate);
   
    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const fetchCategories = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await baseService.get(entities.categories.get, filtersSubmit || filters);
            const filteredCategories = response.result.data.map(category => ({
                id: category.id,
                name: category.name,
                deleted_at: category.deleted_at ? 'deleted-' + category.deleted_at : 'deleted-null'
            }));
            setCategories(filteredCategories);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [filters, showLoader, hideLoader]);

    const {
        handleFilterSubmit,
        handleClearFilters,
        inputsfilters
    } = useCategoryFilters(fetchCategories, filters, setFilters); 

    useEffect(() => {
        fetchCategories();
    }, []);

    const headers = ['id', 'Nome'];
    const actions = [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Categoria',
            buttonClass: 'btn-primary',
            permission: 'Atualizar categorias de produto',
            onClick: (category) => navigate(`/categorias/editar/${category.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Categoria',
            buttonClass: 'btn-danger',
            permission: 'Excluir categorias de produto',
            onClick: (category) => handleDelete(category, 'Você tem certeza que deseja excluir?', entities.categories.delete(category.id), fetchCategories),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Categoria',
            buttonClass: 'btn-info',
            permission: 'Atualizar categorias de produto',
            onClick: (category) => handleActivate(category, 'Você tem certeza que deseja ativar?'),
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Categorias" showBackButton={true} backUrl="/dashboard" />
            <FilterForm 
                autoCompleteFields={inputsfilters} 
                onSubmit={handleFilterSubmit}
                onClear={handleClearFilters}
            />
            
            <ListHeader 
                title="Lista de Categorias"
                buttonText="Nova Categoria"
                buttonLink="/categorias/criar"
                canAccess={canAccess}
                permission="Criar categorias de produto"
            />

            <DynamicTable 
                headers={headers} 
                data={categories} 
                actions={actions} 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchCategories}
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
        </MainLayout>
    );
};

export default CategoryPage;
