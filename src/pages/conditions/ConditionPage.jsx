import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import ConditionService from "../../services/ConditionService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import useConditionService from "../../hooks/useConditionService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";

const ConditionPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [name, setName] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [conditionToDelete, setConditionToDelete] = useState(null);
    const [conditions, setConditions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { fetchConditions, deleteCondition } = useConditionService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        if (location.state?.message) {
          showNotification('error', location.state.message);
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, [location, navigate]);
      
    const handleClearFilters = () => {
        setName('');
    };

    const fetchCondition = useCallback (async (page = 1) => {
        try {
            showLoader();
        
            const response = await fetchConditions({ page, perPage: itemsPerPage });

            const filteredCondition = response.data.map(role => ({
                id: role.id,
                name: role.name
            }));
        
            setConditions(filteredCondition);
            setTotalPages(response.last_page);
            setCurrentPage(response.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar condições';
            showNotification('error', errorMessage);
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [fetchConditions, showLoader, hideLoader, showNotification, itemsPerPage]);
    
    useEffect(() => {
        fetchCondition();
    }, []);

    const handleEdit = useCallback((condition) => {
        navigate(`/condicoes/editar/${condition.id}`);
    }, []);

    const handleDelete = useCallback((condition) => {
        setConditionToDelete(condition);
        setDeleteModalOpen(true);
    },[]);

    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await deleteCondition(conditionToDelete.id);
            fetchCondition();
            return;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao excluir condição';
            showNotification('error', errorMessage);
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [showLoader, hideLoader, fetchCondition, showNotification, deleteCondition, conditionToDelete]);

    const headers = useMemo(() => ['id', 'Nome'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Categoria',
            buttonClass: 'btn-primary',
            permission: 'Atualizar condições de produto',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Categoria',
            buttonClass: 'btn-danger',
            permission: 'Excluir condições de produto',
            onClick: handleDelete
        }
    ], [handleDelete, handleEdit]);
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Condições
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Condição:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da condição"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Condições
                    </div>
                    {canAccess('Criar condições de produtos') && (
                        <Button
                        text="Nova Condição"
                        className="btn btn-blue-light fw-semibold"
                        link="/condicoes/criar"
                        />
                    )}
                </div>

                
                <DynamicTable 
                    headers={headers} 
                    data={conditions} 
                    actions={actions} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchCondition}
                />
                

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={conditionToDelete ? conditionToDelete.name : ''}
                />
            </div>
        </MainLayout>

    )
}

export default ConditionPage;