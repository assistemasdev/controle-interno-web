import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import UnitService from "../../services/UnitService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faLink } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";

const UnitPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [unitToDelete, setUnityToDelete] = useState(null);
    const [types, setUnits] = useState([]);
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

    const fetchUnits = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await UnitService.getAll({page, perPage: itemsPerPage}, navigate);

            const result = response.result
        
            const filteredUnits = result.data.map(unit => ({
                id: unit.id,
                name: unit.name,
                abbreviation: unit.abbreviation
            }));
        
            setUnits(filteredUnits);
            setCurrentPage(result.currentPage);
            setTotalPages(result.last_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar unidades';
            setError(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUnits();
    }, []);

    const handleEdit = (unit) => {
        navigate(`/unidades/editar/${unit.id}`);
    };

    const handleDelete = (unit) => {
        setUnityToDelete(unit);
        setDeleteModalOpen(true);
    };
    const handleViewRelatedUnits = (unit) => {
        navigate(`/unidades/${unit.id}/relacionadas`);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await UnitService.delete(unitToDelete.id);

            setMessage({ type: 'success', text: response.message });
            fetchUnits();
            return;
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'error ao excluir unidade' });
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Nome', 'Abreviação'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Unidade',
            buttonClass: 'btn-primary',
            permission: 'Atualizar tipos de produto',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Unidade',
            buttonClass: 'btn-danger',
            permission: 'Excluir tipos de produto',
            onClick: handleDelete
        },
        {
            icon: faLink, 
            title: 'Ver unidades relacionadas',
            buttonClass: 'btn-info',
            permission: 'Listar unidades de medida relacionadas',
            onClick: handleViewRelatedUnits
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Unidades
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Unidade:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da unidade"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Unidades
                    </div>
                    {canAccess('Criar unidades de medida') && (
                        <Button
                        text="Nova Unidade"
                        className="btn btn-blue-light fw-semibold"
                        link="/unidades/criar"
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
                        data={types} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchUnits}
                    />
                )}

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={unitToDelete ? unitToDelete.name : ''}
                />
            </div>
        </MainLayout>

    )
}

export default UnitPage;