import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import CategoryService from "../../services/CategoryService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";

const CategoryPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await CategoryService.getAll({page, perPage: itemsPerPage} ,navigate);
            const result = response.result
        
            const filteredCategories = result.data.map(role => ({
                id: role.id,
                name: role.name
            }));
        
            setCategories(filteredCategories);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir categoria';
            setError(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        navigate(`/categorias/editar/${category.id}`);
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await CategoryService.delete(categoryToDelete.id);

            setMessage({ type: 'success', text: response.message });
            fetchCategories();
            return;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir categoria';
            setError(errorMessage);
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Nome'];

    const actions = [
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
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Categorias
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Categoria:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da categoria"
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

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                    ) : error ? (
                    <div className='mt-3'>
                        <MyAlert notTime={true} severity="error" message={error} />
                    </div>
                    ) : (
                    <DynamicTable 
                        headers={headers} 
                        data={categories} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchCategories}
                    />
                )}

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