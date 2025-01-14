import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useLoader from "../../hooks/useLoader";
import useCategoryService from "../../hooks/useCategoryService";
import useNotification from "../../hooks/useNotification";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";

const CategoryPage = () => {
    const { canAccess } = usePermissions();
    const [name, setName] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { fetchCategories: getCategories, deleteCategory } = useCategoryService(navigate);
    const { showNotification } = useNotification();

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

    const fetchCategories = useCallback(async (id, name, idLike, filledInputs, page = 1) => {
        try {
            showLoader();
            
            const response = await getCategories({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });
            
            const filteredCategories = response.data.map(role => ({
                id: role.id,
                name: role.name,
            }));
            
            setCategories(filteredCategories);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [getCategories, itemsPerPage, showLoader, hideLoader]);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();

        const filledInputs = new Set(
            selectedCategories.map((option) => option.column)
        ).size;

        fetchCategories(
            selectedCategories.filter((option) => option.textFilter === false || (option.column === 'id' && option.numberFilter === false)).map((item) => item.value),
            selectedCategories.filter((option) => option.textFilter === true && option.column === 'name').map((item) => item.value),
            selectedCategories.filter((option) => option.numberFilter === true && option.column === 'id').map((item) => item.value),
            filledInputs
        );
    }, [selectedCategories, fetchCategories]);

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
    
    const handleDelete = useCallback((category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    }, []);
    
    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await deleteCategory(categoryToDelete.id);
            fetchCategories();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [categoryToDelete, deleteCategory, fetchCategories, showLoader, hideLoader]);
    

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Categoria',
            buttonClass: 'btn-primary',
            permission: 'Atualizar categorias de produto',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Categoria',
            buttonClass: 'btn-danger',
            permission: 'Excluir categorias de produto',
            onClick: handleDelete
        }
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
                />
                

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={categoryToDelete ? categoryToDelete.name : ''}
                />
            </div>
        </MainLayout>

    )
}

export default CategoryPage;