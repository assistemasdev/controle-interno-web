import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/MainLayout";
import MyAlert from "../../../components/MyAlert";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../../components/DynamicTable";
import TypeGroupsService from "../../../services/TypeGroupsService";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faTrash, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

const GroupsTypePage = () => {
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);
    const [groupsOfTheTypes, setGroupsOfTheTypes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchGroupsOfTheTypes = async () => {
        try {
            setLoading(true);
        
            const response = await TypeGroupsService.showTypeGroups(id,navigate);
            const result = response.result
        
                const groupsOfTheTypes = result.map(role => ({
                    id: role.id,
                    name: role.name
            }));
        
            setGroupsOfTheTypes(groupsOfTheTypes);
        } catch (error) {
            setError('Erro ao carregar grupos do tipo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchGroupsOfTheTypes();
    }, []);


    const handleDelete = (type) => {
        setTypeToDelete(type);
        setDeleteModalOpen(true);
    };
    const handleViewGroups = (type) => {
        navigate(`/tipos/${type.id}/grupos`);
    }

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await TypeGroupsService.detachGroupFromType(id, { group_id:[typeToDelete.id]}, navigate);
            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchGroupsOfTheTypes();
            }
        } catch (error) {
            setError('Erro ao excluir o tipo');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Nome'];

    const actions = [
        {
            icon: faTrash,
            title: 'Excluir Grupo',
            buttonClass: 'btn-danger',
            permission: 'Desassociar grupo de tipo de produto',
            onClick: handleDelete
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Grupos do tipo
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
                        Lista dos Grupos do Tipo
                    </div>
                    {canAccess('Associar grupo a tipo de produto') && (
                        <Button
                        text="Associar grupo"
                        className="btn btn-blue-light fw-semibold"
                        link={`/tipos/${id}/grupos/associar`}
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
                    <DynamicTable headers={headers} data={groupsOfTheTypes} actions={actions} />
                )}

                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={typeToDelete ? typeToDelete.name : ''}
                />
            </div>
        </MainLayout>

    )
}

export default GroupsTypePage;