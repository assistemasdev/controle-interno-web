import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import CustomerService from "../../services/CustomerService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye  } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";

const CostumerPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = (e) => {
        window.location.reload()
    };

    const fetchCustomers = async (id,name, idLike, filledInputs,page = 1) => {
        try {
            setLoading(true);
            const response = await CustomerService.getAll({id, name, idLike, filledInputs, page, perPage: itemsPerPage}, navigate);
            const result = response.result

            const filteredCustomers = result.data.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');
            
                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue) 
                };
            });
            
            setCustomers(filteredCustomers);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar clientes';
            setError(errorMessage);
            console.error("Erro capturado no fetchCustomers:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
    
        const filledInputs = new Set(
            selectedCustomers.map((option) => option.column)
        ).size;
    
        fetchCustomers(
            selectedCustomers.filter((option) => option.textFilter == false || (option.column === 'id' && option.numberFilter == false)).map((item) => item.value),
            selectedCustomers.filter((option) => option.textFilter == true && option.column === 'name').map((item) => item.value),
            selectedCustomers.filter((option) => option.numberFilter == true && option.column === 'id').map((item) => item.value),
            filledInputs 
        );
    };

    const handleChangeCustomers = (newSelected, column) => {
        setSelectedCustomers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }
    
            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
    
            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    };

    const handleEdit = (customer) => {
        navigate(`/clientes/editar/${customer.id}`);
    };

    const handleDelete = (customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    };

    const handleViewDetails = (customer) => {
        navigate(`/clientes/detalhes/${customer.id}`);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await CustomerService.delete(customerToDelete.id);

            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchCustomers();
                return
            }

            if(response.status == 404 || response.status == 400) {
                setMessage({ type: 'error', text: response.message });
                return
            }
        } catch (error) {
            setError('Erro ao excluir o fornecedor');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const headers = ['id', 'Apelido', 'Nome', 'CPF/CPNPJ'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar clientes',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir clientes',
            onClick: handleDelete
        },{
            icon: faEye, 
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver clientes', 
            onClick: handleViewDetails 
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Clientes
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilterSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className='text-dark font-weight-bold mt-1'>Número:</label>
                        <AutoCompleteFilter
                            value={selectedCustomers.filter((option) => option.column === 'id')}
                            service={CustomerService}
                            columnDataBase="id"
                            isMulti={true}
                            onChange={(newSelected) => handleChangeCustomers(newSelected, "id")}
                            onBlurColumn='numberFilter'
                            placeholder="Filtre os usuários pelo número"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="name" className='text-dark font-weight-bold mt-1'>Nome:</label>
                        <AutoCompleteFilter
                            value={selectedCustomers.filter((option) => option.column === 'name')}
                            service={CustomerService}
                            columnDataBase='name'
                            isMulti={true}
                            onChange={(newSelected) => handleChangeCustomers(newSelected, "name")}
                            onBlurColumn='textFilter'
                            placeholder="Filtre os usuários pelo nome"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Clientes
                    </div>
                    {canAccess('Criar clientes') && (
                        <Button
                        text="Novo Cliente"
                        className="btn btn-blue-light fw-semibold"
                        link="/clientes/criar"
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
                        data={customers} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchCustomers}
                    />
                )}

            </div>
            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={customerToDelete ? customerToDelete.name : ''}
            />
        </MainLayout>
    )
}

export default CostumerPage;