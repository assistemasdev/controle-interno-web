import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrashAlt, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import useLoader from '../../hooks/useLoader';
import useNotification from "../../hooks/useNotification";
import useOrganizationService from "../../hooks/useOrganizationService";
import { PAGINATION } from '../../constants/pagination';
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

const OrganizationPage = () => {
    const { canAccess } = usePermissions();
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchAll, deleteOrganization } = useOrganizationService(navigate);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [selectedOrg, setSelectedOrg] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);  
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        id: '',
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
    }, [location.state]); 
    
    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const fetchOrganizations = useCallback(async (filtersSubmit) => {
        try {
            showLoader();
        
            const response = await fetchAll(filtersSubmit || filters);
            const filteredOrganizations = response.data.map(organization => ({
                id: organization.id,
                name: organization.name,
                color: organization.color,
                deleted_at: organization.deleted_at ? 'deleted-' + organization.deleted_at : 'deleted-null'
            }));
            
            setCurrentPage(response.current_page)
            setTotalPages(response.last_page);
            setOrganizations(filteredOrganizations);
        } catch (error) {
            showNotification('error','Erro ao carregar organizações');
            console.error(error);
        } finally {
            hideLoader();
        }
    },[showLoader, fetchAll, showNotification, hideLoader]);
    
    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();
    
        const selectedOrgIds = selectedOrgs
            .filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false))
            .map((type) => type.value);
    
        const selectedNames = selectedOrgs
            .filter((type) => type.textFilter === true && type.column === 'name')
            .map((type) => type.value);
    
        const selectedIdLikes = selectedOrgs
            .filter((type) => type.numberFilter === true && type.column === 'id')
            .map((type) => type.value);
    
        const filledInputs = new Set(selectedOrgs.map((option) => option.column)).size;
    
        const previousFilters = filters || {}; 
    
        setFilters(prev => ({
            ...prev,
            id: selectedOrgIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));

        fetchOrganizations({
            id: selectedOrgIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    }, [selectedOrgs, fetchOrganizations]);

    const handleChangeOrg = useCallback((newSelected, column) => {
        setSelectedOrgs((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleEdit = useCallback((organization) => {
        navigate(`/organizacoes/editar/${organization.id}`);
    }, [navigate, ]);

    const handleDetails = useCallback((organization) => {
        navigate(`/organizacoes/detalhes/${organization.id}`);
    }, [navigate, ])

    const handleActivate = (user, action) => {
        setSelectedOrg(user); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleDelete = (user, action) => {
        setSelectedOrg(user);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            showLoader();
            await deleteOrganization(id);
            setOpenModalConfirmation(false);  
            fetchOrganizations();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao excluir o usuário');
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };

    const headers = useMemo(() => ['id', 'Nome', 'Cor'], []);

    const actions = useMemo(() => [
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
        },
        {
            id: 'delete',
            icon: faTrashAlt,
            title: 'Excluir usuário',
            buttonClass: 'btn-danger',
            permission: 'Excluir organizações',
            onClick: handleDelete,
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar usuário',
            buttonClass: 'btn-info',
            permission: 'Atualizar organizações',
            onClick: handleActivate,
        },
    ], [handleEdit, handleDetails]);
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Organizações
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='organization'
                            value={selectedOrgs.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeOrg(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os grupos pelo número"
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
                            model='organization'
                            value={selectedOrgs.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeOrg(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os grupos pelo nome"
                            isMulti
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar Filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
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
                        link={`/organizacoes/criar/`}
                        />
                    )}
                </div>

                <DynamicTable 
                    headers={headers} 
                    data={organizations} 
                    actions={actions} 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={fetchOrganizations}
                    filters={filters}
                    setFilters={setFilters}
                />

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedOrg.id) : console.log('oi')}
                    itemName={selectedOrg ? selectedOrg.name : ''}
                    text={action.text}
                />

            </div>
        </MainLayout>

    )
}

export default OrganizationPage;