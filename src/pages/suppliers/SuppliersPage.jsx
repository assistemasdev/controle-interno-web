import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import SupplierService from "../../services/SupplierService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit, faTrash, faEye  } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../constants/pagination";

const SuppliersPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
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

    const fetchSuppliers = async (page = 1) => {
        try {
            setLoading(true);
        
            const response = await SupplierService.getAll({page, perPage: itemsPerPage}, navigate);
            const result = response.result

            const filteredSuppliers = result.data.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');
            
                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue) 
                };
            });
            
            setSuppliers(filteredSuppliers);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar fornecedores';
            setError(errorMessage);
            console.error("Erro capturado no fetchSuppliers:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (supplier) => {
        navigate(`/fornecedores/editar/${supplier.id}`);
    };

    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setDeleteModalOpen(true);
    };

    const handleViewDetails = (supplier) => {
        navigate(`/fornecedores/detalhes/${supplier.id}`);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await SupplierService.delete(supplierToDelete.id);

            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchSuppliers();
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
            permission: 'Atualizar fornecedores',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Fornecedor',
            buttonClass: 'btn-danger',
            permission: 'Excluir fornecedores',
            onClick: handleDelete
        },{
            icon: faEye, 
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver fornecedores', 
            onClick: handleViewDetails 
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Fornecedores
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do fornecedores:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do fornecedor"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Fornecedores
                    </div>
                    {canAccess('Criar fornecedores') && (
                        <Button
                        text="Novo Fornecedor"
                        className="btn btn-blue-light fw-semibold"
                        link="/fornecedores/criar"
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
                        data={suppliers} 
                        actions={actions} 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchSuppliers}
                    />
                )}

            </div>
            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={supplierToDelete ? supplierToDelete.name : ''}
            />
        </MainLayout>
    )
}

export default SuppliersPage;