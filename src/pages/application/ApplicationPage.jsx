import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import ApplicationService from "../../services/ApplicationService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faBuilding  } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";

const ApplicationPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
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

    const fetchApplications = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await ApplicationService.getAll({ page, perPage: itemsPerPage },navigate);
            const result = response.result
        
            const filteredApplications = result.data.map(application => ({
                id: application.id,
                name: application.name,
                sessionCode: application.session_code,
                active: application.active == true ? 'Sim' : 'Não'
            }));
            
            setApplications(filteredApplications);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar aplicações';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchApplications();
    }, []);

    const handleEdit = (application) => {
        navigate(`/aplicacoes/editar/${application.id}`);
    };

    const handleViewOrgans = (application) => {
    navigate(`/orgaos/${application.id}`);
    }

    const headers = ['id', 'Nome', 'Código de Sessão', 'Ativo'];

    const actions = [
    {
        icon: faEdit,
        title: 'Editar Aplicação',
        buttonClass: 'btn-primary',
        permission: 'update application',
        onClick: handleEdit
    },
    {
        icon: faBuilding, 
        title: 'Ver Órgãos da Aplicação',
        buttonClass: 'btn-info',  
        permission: 'view application organs', 
        onClick: handleViewOrgans,  
    },
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Aplicações
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome da Aplicação:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da aplicação"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Aplicações
                    </div>
                    {canAccess('create applications') && (
                        <Button
                        text="Nova Aplicação"
                        className="btn btn-blue-light fw-semibold"
                        link="/aplicacoes/criar"
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
                        data={applications} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchApplications}
                    />
                )}

            </div>
        </MainLayout>
    )
}

export default ApplicationPage;