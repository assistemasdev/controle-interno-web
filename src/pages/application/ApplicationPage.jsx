import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import useLoader from "../../hooks/useLoader";
import useNotification from "../../hooks/useNotification";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
import baseService from "../../services/baseService";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import useBaseService from "../../hooks/services/useBaseService";
import { entities } from "../../constants/entities";
import { buildFilteredArray } from "../../utils/arrayUtils";

const ApplicationPage = () => {
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { get: fetchAll, del: remove } = useBaseService(navigate);
    const location = useLocation();
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedApplication, setSelectedApplication] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        idlike: '',
        filledInputs: '',
        deleted_at: false,
        page: 1,
        perPage:itemsPerPage
    })
    const [action, setAction] = useState({
        action: '',
        text: '',
    });

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, showNotification, navigate]);
    

    const fetchApplications = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
            const response = await fetchAll(entities.applications.get, filtersSubmit || filters);
            setApplications(response.result.data.map(app => ({
                id: app.id,
                name: app.name,
                sessionCode: app.session_code,
                deleted_at: app.deleted_at ? 'deleted-' + app.deleted_at : 'deleted-null'
            })));
            setCurrentPage(response.result.current_page);
            setTotalPages(response.result.last_page);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchAll, itemsPerPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const selectedIdLikes = buildFilteredArray(selectedApplications, 'id', 'numberFilter', true);
        const selectedNames = buildFilteredArray(selectedApplications, 'id', 'textFilter', true);
        const selectedApplicationIds = buildFilteredArray(selectedApplications, 'id', 'numberFilter', false);
        const filledInputs = new Set(selectedApplications.map((option) => option.column)).size;
        const previousFilters = filters || {}; 

        setFilters(prev => ({
            ...prev,
            id: selectedApplicationIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchApplications({
            id: selectedApplicationIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
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
        window.location.reload();
    }, []);

    const handleEdit = useCallback((application) => {
        navigate(`/aplicacoes/editar/${application.id}`);
    }, [navigate]);

    const handleViewOrgans = useCallback((application) => {
        navigate(`/orgaos/${application.id}`);
    }, [navigate]);

    const handleActivate = (application, action) => {
        setSelectedApplication(application); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (application, action) => {
        setSelectedApplication(application);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await remove(entities.applications.delete(id));
            setOpenModalConfirmation(false);  
            fetchApplications();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };


    const headers = useMemo(() => ['id', 'Nome', 'Código de Sessão'], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Aplicação',
            buttonClass: 'btn-primary',
            permission: 'Atualizar aplicações',
            onClick: handleEdit,
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir aplicações',
            buttonClass: 'btn-danger',
            permission: 'delete applications',
            onClick: handleDelete,
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar aplicações',
            onClick: handleActivate,
        },
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
                    filters={filters}
                    setFilters={setFilters}
                />
                
                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedApplication.id) : console.log('oi')}
                    itemName={selectedApplication ? selectedApplication.name : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default ApplicationPage;
