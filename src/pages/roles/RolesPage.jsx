import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import RoleService from "../../services/RoleService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";

const RolePage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = useCallback(() => {
        window.location.reload();
    }, []);

    const fetchRoles = async (id, name, idLike, filledInputs, page = 1) => {
        try {
            setLoading(true);
        
            const response = await RoleService.getRoles({ id, name, idLike, filledInputs, page, perPage: itemsPerPage }, navigate);
            const result = response.result
            const filteredRoles = result.data.map(role => ({
                id: role.id,
                name: role.name
            }));
        
            setRoles(filteredRoles);
            setCurrentPage(result.current_page);
            setTotalPages(result.last_page);
        } catch (error) {
            setError('Erro ao carregar cargos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const filledInputs = new Set(selectedRoles.map((option) => option.column)).size;

        fetchRoles(
            selectedRoles.filter((type) => type.textFilter === false || (type.column === 'id' && type.numberFilter === false)).map((type) => type.value),
            selectedRoles.filter((type) => type.textFilter === true && type.column === 'name').map((type) => type.value),
            selectedRoles.filter((type) => type.numberFilter === true && type.column === 'id').map((type) => type.value),
            filledInputs
        );
    };
    
    const handleChangeRoles = useCallback((newSelected, column) => {
        setSelectedRoles((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];

            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

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

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className="text-dark font-weight-bold mt-1">
                            Número:
                        </label>
                        <AutoCompleteFilter
                            service={baseService}
                            columnDataBase="id"
                            model='role'
                            value={selectedRoles.filter((option) => option.column === 'id')}
                            onChange={(selected) => handleChangeRoles(selected, 'id')}
                            onBlurColumn="numberFilter"
                            placeholder="Filtre os cargos pelo número"
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
                            model='role'
                            value={selectedRoles.filter((option) => option.column === 'name')}
                            onChange={(selected) => handleChangeRoles(selected, 'name')}
                            onBlurColumn="textFilter"
                            placeholder="Filtre os cargos pelo nome"
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
                    <DynamicTable headers={headers} data={roles} actions={actions} currentPage={currentPage} totalPages={totalPages} onPageChange={fetchRoles} />
                )}
            </div>
        </MainLayout>

    )
}

export default RolePage;