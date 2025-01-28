import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import { buildFilteredArray } from "../../utils/arrayUtils";

const CategoryPage = () => {
    const { canAccess } = usePermissions();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const { showNotification } = useNotification();
    const [selectedCategory, setSelectedCategory] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [action, setAction] = useState({
        action: '',
        text: '',
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]); 
    
    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            
            const response = await fetchAll(entities.categories.get, filtersSubmit || filters);
            
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
    }, [fetchAll, itemsPerPage, showLoader, hideLoader]);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();
    
        const selectedCatIds = buildFilteredArray(selectedCategories, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedCategories, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedCategories, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedCategories.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedCatIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchCategories({
            id: selectedCatIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    }, [selectedCategories, fetchCategories, setFilters]);
    
    const handleChangeOrg = useCallback((newSelected, column) => {
        setSelectedCategories((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);
    
    const handleEdit = useCallback((category) => {
        navigate(`/categorias/editar/${category.id}`);
    }, [navigate]);
    
    const handleActivate = (category, action) => {
        setSelectedCategory(category); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleDelete = (category, action) => {
        setSelectedCategory(category);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.categories.delete(id));
            setOpenModalConfirmation(false);  
            fetchCategories();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };
    
    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Categoria',
            buttonClass: 'btn-primary',
            permission: 'Atualizar categorias de produto',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Categoria',
            buttonClass: 'btn-danger',
            permission: 'Excluir categorias de produto',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar categorias de produto',
            onClick: handleActivate,
        },
    ], [handleDelete, handleEdit]);
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Categorias
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='category'
                            value={selectedCategories.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeOrg(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os grupos pelo número"
                            isMulti
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Nome:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="name"
                            model='category'
                            value={selectedCategories.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeOrg(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os grupos pelo nome"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Categorias
                    </div>
                    {canAccess('Criar categorias de produto') && (
                        <Button
                        text="Nova Categoria"
                        className="btn btn-blue-light fw-semibold"
                        link="/categorias/criar"
                        />
                    )}
                </div>

               
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
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedCategory.id) : console.log('oi')}
                    itemName={selectedCategory ? selectedCategory.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>

    )
}

export default CategoryPage;