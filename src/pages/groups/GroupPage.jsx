import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import GroupService from "../../services/GroupService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";

const GroupPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [groups, setGroups] = useState([]);
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

    const fetchGroup = async (page = 1) => {
        try {
            setLoading(true);
            
            const response = await GroupService.getAll({page, perPage: itemsPerPage},navigate);
            const filteredGroups = response.result.data.map(role => ({
                id: role.id,
                name: role.name,
            }));
            
            setGroups(filteredGroups);
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            setError(error.message || 'Erro ao carregar grupos');
            console.error("Erro capturado no fetchGroup:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, []);

    const handleEdit = (condition) => {
        navigate(`/grupos/editar/${condition.id}`);
    };

    const handleDelete = (condition) => {
        setGroupToDelete(condition);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await GroupService.delete(groupToDelete.id);
            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchGroup();
                return
            }

            if (response.status === 400 || response.status === 404) {
                setMessage({ type: 'error', text: response.message });
                return
            }
        } catch (error) {
            setError('Erro ao excluir o grupo');
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
            title: 'Editar Grupo',
            buttonClass: 'btn-primary',
            permission: 'Atualizar grupos de produto',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Grupo',
            buttonClass: 'btn-danger',
            permission: 'Excluir grupos de produto',
            onClick: handleDelete
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Grupos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do Grupo:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do grupo"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Grupos
                    </div>
                    {canAccess('Criar grupos de produto') && (
                        <Button
                        text="Novo Grupo"
                        className="btn btn-blue-light fw-semibold"
                        link="/grupos/criar"
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
                        data={groups} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchGroup}
                    />
                )}

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={groupToDelete ? groupToDelete.name : ''}
                />
            </div>
        </MainLayout>

    )
}

export default GroupPage;