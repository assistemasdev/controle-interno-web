import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../layouts/MainLayout";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faEye  } from '@fortawesome/free-solid-svg-icons';
import useLoader from '../../hooks/useLoader';
import useNotification from "../../hooks/useNotification";
import useOrganizationService from "../../hooks/useOrganizationService";
import { PAGINATION } from '../../constants/pagination';

const OrganizationPage = () => {
    const { canAccess } = usePermissions();
    const [name, setName] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchAll } = useOrganizationService(navigate);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchOrganizations = useCallback(async (page = 1) => {
        try {
            showLoader();
        
            const response = await fetchAll();
            const filteredOrganizations = response.data.map(organization => ({
                id: organization.id,
                name: organization.name,
                color: organization.color,
                active: organization.active == true ? 'Sim' : 'Não'
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

    const handleEdit = useCallback((organization) => {
        navigate(`/organizacoes/editar/${organization.id}`);
    }, [navigate, ]);

    const handleDetails = useCallback((organization) => {
        navigate(`/organizacoes/detalhes/${organization.id}`);
    }, [navigate, ])

    const headers = useMemo(() => ['id', 'Nome', 'Cor', 'Ativo'], []);

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
        }
    ], [handleEdit, handleDetails]);
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Organizações
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
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
                />

            </div>
        </MainLayout>

    )
}

export default OrganizationPage;