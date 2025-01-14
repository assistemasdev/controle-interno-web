import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import useApplicationService from "../../hooks/useApplicationService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";

const ApplicationPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchApplications: fetchApplicationsService } = useApplicationService();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]);
    

    const fetchApplications = useCallback(async (page = 1) => {
        try {
            showLoader();
            const result = await fetchApplicationsService({ page, perPage: itemsPerPage, name });
            setApplications(result.data.map(app => ({
                id: app.id,
                name: app.name,
                sessionCode: app.session_code,
                active: app.active ? 'Sim' : 'Não',
            })));
            setCurrentPage(result.current_page);
            setTotalPages(result.last_page);
        } catch (error) {
            showNotification('error', error.message || 'Erro ao carregar aplicações.');
        } finally {
            hideLoader();
        }
    }, [fetchApplicationsService, itemsPerPage, name, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleClearFilters = useCallback(() => {
        setName('');
        fetchApplications();
    }, [fetchApplications]);

    const handleEdit = useCallback((application) => {
        navigate(`/aplicacoes/editar/${application.id}`);
    }, [navigate]);

    const handleViewOrgans = useCallback((application) => {
        navigate(`/orgaos/${application.id}`);
    }, [navigate]);

    const headers = useMemo(() => ['id', 'Nome', 'Código de Sessão', 'Ativo'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Aplicação',
            buttonClass: 'btn-primary',
            permission: 'update application',
            onClick: handleEdit,
        }
    ], [handleEdit, handleViewOrgans]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">Aplicações</p>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2 theme-background">
                    <div className="form-group col-md-12">
                        <InputField
                            label="Nome da Aplicação:"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da aplicação"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="button" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" onClick={() => fetchApplications()} />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <p className="font-weight-bold text-uppercase mb-1 d-flex">Lista de Aplicações</p>
                    {canAccess('create applications') && (
                        <Button text="Nova Aplicação" className="btn btn-blue-light fw-semibold" link="/aplicacoes/criar" />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={applications}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchApplications}
                />
                
            </div>
        </MainLayout>
    );
};

export default ApplicationPage;
