import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import OrganizationService from "../../services/OrganizationService";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faEye  } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
const OrganizationPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { applicationId } = useParams();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, message: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchOrganizations = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await OrganizationService.getByApplicationId(applicationId,navigate);
            const result = response.result
        
            const filteredOrganizations = result.map(organization => ({
                id: organization.id,
                name: organization.name,
                color: organization.color,
                active: organization.active == true ? 'Sim' : 'Não'
            }));
            
            setOrganizations(filteredOrganizations);
        } catch (error) {
            setError('Erro ao carregar organizações');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleEdit = (organization) => {
        navigate(`/orgaos/editar/${applicationId}/${organization.id}`);
    };

    const handleDetails = (organization) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organization.id}`);
    }

    const headers = ['id', 'Nome', 'Cor', 'Ativo'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Organização',
            buttonClass: 'btn-primary',
            permission: 'Atualizar organizações',
            onClick: handleEdit
        },
        {
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver organizações',
            onClick: handleDetails
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Organizações
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Organização:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da organização"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Organizações
                    </div>
                    {canAccess('create organizations') && (
                        <Button
                        text="Nova Organização"
                        className="btn btn-blue-light fw-semibold"
                        link={`/orgaos/criar/${applicationId}`}
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
                    <DynamicTable headers={headers} data={organizations} actions={actions} />
                )}

            </div>
        </MainLayout>

    )
}

export default OrganizationPage;