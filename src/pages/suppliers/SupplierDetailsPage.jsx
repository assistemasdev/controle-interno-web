import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import SupplierService from '../../services/SupplierService';
import { maskCpfCnpj, maskCep } from '../../utils/maskUtils';
import DynamicTable from '../../components/DynamicTable';
import { faEdit, faTrash, faEye  } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState();
    const { canAccess } = usePermissions();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: '',
        ddd: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'cpf_cnpj' ? maskCpfCnpj(value) : value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSupplier();
                await fetchAddresses();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };

        fetchData();
    }, [id]);

    const fetchAddresses = async () => {
        try {
            const response = await SupplierService.allSupplierAddress(id, navigate);
            if (response.status === 200) {
                 const filteredAddress = response.result.map(address => {                
                    return {
                        id: address.id,
                        zip: maskCep(address.zip),
                        street: address.street
                    };
                });
                            
                setAddresses(filteredAddress)
                return
            }

            if (response.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: response.message 
                        }
                    }
                );
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelos endereços do fornecedor' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (address) => {
        navigate(`/fornecedores/editar/${id}/endereco/${address.id}`);
    };

    const handleDelete = (address) => {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const response = await SupplierService.deleteSupplierAddress(id,addressToDelete.id, navigate);

            if (response.status === 200) {
                setMessage({ type: 'success', text: response.message });
                fetchSupplier();
                fetchAddresses();
                return
            }

            if(response.status == 404 || response.status == 400) {
                setMessage({ type: 'error', text: response.message });
                return
            }
        } catch (error) {
            setError('Erro ao excluir o endereço');
            console.error(error);
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const handleViewDetails = (address) => {
        navigate(`/fornecedores/${id}/endereco/${address.id}/detalhes`);
    };

    const headers = ['id', 'CEP', 'Rua'];
    
    const actions = [
        {
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do fornecedor',
            onClick: handleEdit
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do fornecedor',
            onClick: handleDelete
        },
        {
            icon: faEye, 
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver endereços de fornecedores', 
            onClick: handleViewDetails 
        }
    ];

    const fetchSupplier = async () => {
        try {
            const response = await SupplierService.getById(id, navigate);
            const supplier = response.result;

            if (response.status === 200) {
                setFormData({
                    alias: supplier.alias || '',
                    name: supplier.name || '',
                    cpf_cnpj: maskCpfCnpj(supplier.cpf_cnpj || ''), 
                    ddd: supplier.ddd || '',
                    phone: supplier.phone || '',
                    email: supplier.email || ''
                });

                return
            }

            if (response.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: response.message 
                        }
                    }
                );
            }

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelo fornecedor' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/fornecedores/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Fornecedor
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <h5 className='text-dark font-weight-bold mt-3'>Dados do Fornecedor</h5>
                            
                            <hr />
                        
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Apelido:"
                                        type="text"
                                        id="alias"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        placeholder="Digite o apelido do fornecedor"
                                        error={formErrors.alias}
                                        disabled={true}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Nome:"
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do fornecedor"
                                        error={formErrors.name}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="CPF/CNPJ:"
                                        type="text"
                                        id="cpf_cnpj"
                                        value={formData.cpf_cnpj}
                                        onChange={handleChange}
                                        placeholder="Digite o CPF ou CNPJ"
                                        error={formErrors.cpf_cnpj}
                                        disabled={true}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-2">
                                    <InputField
                                        label="DDD:"
                                        type="text"
                                        id="ddd"
                                        value={formData.ddd}
                                        onChange={handleChange}
                                        placeholder="Digite o DDD"
                                        error={formErrors.ddd}
                                        disabled={true}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Telefone:"
                                        type="text"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Digite o telefone"
                                        error={formErrors.phone}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="E-mail:"
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Digite o e-mail"
                                        error={formErrors.email}
                                        disabled={true}
                                    />
                                </div>
                            </div>

                            <div className='form-row d-flex justify-content-between align-items-center mt-1' style={{marginLeft:0, marginRight:0}}>
                                <h5 className='text-dark font-weight-bold mt-3'>Endereços do Fornecedor</h5>
                                {canAccess('Criar fornecedores') && (
                                    <Button
                                    text="Adicionar Endereço"
                                    className="btn btn-blue-light fw-semibold"
                                    link={`/fornecedores/${id}/endereco/adicionar`}
                                    />
                                )}
                            </div>
                            <hr />

                            <DynamicTable headers={headers} data={addresses} actions={actions} />

                            <div className="mt-3 d-flex gap-2">
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={addressToDelete ? addressToDelete.street : ''}
            />
        </MainLayout>
    );
};

export default SupplierDetailsPage;
