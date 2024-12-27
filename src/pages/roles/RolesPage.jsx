import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import RoleService from "../../services/RoleService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const RolePage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
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

    const fetchRoles = async () => {
        try {
            setLoading(true);
        
            const response = await RoleService.getRoles(navigate);
            const result = response.result.data
            const filteredRoles = result.map(role => ({
                id: role.id,
                name: role.name
            }));
        
            setRoles(filteredRoles);
        } catch (error) {
            setError('Erro ao carregar aplicações');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEdit = (application) => {
        navigate(`/cargos/editar/${application.id}`);
    };

    const headers = ['id', 'Nome'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Cargos',
            buttonClass: 'btn-primary',
            permission: 'update application',
            onClick: handleEdit
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cargos
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do Cargo:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do cargo"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Cargos
                    </div>
                    {canAccess('create role') && (
                        <Button
                        text="Nova Cargo"
                        className="btn btn-blue-light fw-semibold"
                        link="/cargos/criar"
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
                    <DynamicTable headers={headers} data={roles} actions={actions} />
                )}
            </div>
        </MainLayout>

    )
}

export default RolePage;