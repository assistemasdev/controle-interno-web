import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useApplicationService from "../../hooks/useApplicationService";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
import baseService from "../../services/baseService";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";

const ApplicationPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchApplications: fetchApplicationsService } = useApplicationService();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedApplications, setSelectedApplications] = useState([]);
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
    

    const fetchApplications = useCallback(async (id, name, idLike, filledInputs, page = 1) => {
        try {
            showLoader();
            const result = await fetchApplicationsService({ id, name, idLike, filledInputs, page, perPage: itemsPerPage });
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

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const filledInputs = new Set(selectedApplications.map((option) => option.column)).size;

        fetchApplications(
            selectedApplications.filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false)).map((type) => type.value),
            selectedApplications.filter((type) => type.textFilter === true && type.column === 'name').map((type) => type.value),
            selectedApplications.filter((type) => type.numberFilter === true && type.column === 'id').map((type) => type.value),
            filledInputs
        );
    };
    
    const handleChangeApplications = useCallback((newSelected, column) => {
        setSelectedApplications((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
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

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='application'
                            value={selectedApplications.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeApplications(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre as aplicações pelo número"
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
                            model='application'
                            value={selectedApplications.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeApplications(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre as aplicações pelo nome"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
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
