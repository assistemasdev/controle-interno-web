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
import { faEdit, faTrash, faEye, faMapMarkerAlt  } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState();
    const { canAccess } = usePermissions();
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: ''
    });
    const [currentPageAddress, setCurrentPageAddress] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPagesAddress, setTotalPagesAddress] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [currentPageContact, setCurrentPageContact] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesContact, setTotalPagesContact] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [id]: id === 'cpf_cnpj' ? maskCpfCnpj(value) : value
        }));
    };

    useEffect(() => {
        fetchData();
    }, [id]);
    

    const fetchData = async (page = 1) => {
        setLoading(true);
        setMessage(null);
        try {
            const [organizationResponse, addressesResponse, contactsResponse] = await Promise.all([
                SupplierService.getById(id, navigate),
                SupplierService.getAllSupplierAddress(id, {page, perPage:itemsPerPage}, navigate),
                SupplierService.getAllSupplierContact(id, {page, perPage:itemsPerPage}, navigate)
            ]);

            const supplier = organizationResponse.result;

            setFormData({
                alias: supplier.alias || '',
                name: supplier.name || '',
                cpf_cnpj: maskCpfCnpj(supplier.cpf_cnpj || '')
            });       

            const filteredAddress = addressesResponse.result.data.map(address => {                
                return {
                    id: address.id,
                    zip: maskCep(address.zip),
                    street: address.street
                };
            });
                        
            setAddresses(filteredAddress)
            setTotalPagesAddress(addressesResponse.result.last_page);
            setCurrentPageAddress(addressesResponse.result.current_page);

            const filteredContacts = contactsResponse.result.data.map(contact => {                
                return {
                    id: contact.id,
                    name: `${contact.name || ''} ${contact.surname || ''}`,
                    number: `${contact.ddd || ''} ${contact.phone || ''}`,
                };
            });
                        
            setContacts(filteredContacts)
            setTotalPagesContact(contactsResponse.result.last_page);
            setCurrentPageContact(contactsResponse.result.current_page);

        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar os dados do fornecedor' });
        } finally {
            setLoading(false);
        }
    };
    
    const fetchAddresses = async (page = 1) => {
        setLoading(true);
        try {
            const response = await SupplierService.getAllSupplierAddress(id, {page, perPage: itemsPerPage}, navigate);
            const filteredAddress = response.result.data.map(address => {                
                return {
                    id: address.id,
                    zip: maskCep(address.zip),
                    street: address.street
                };
            });
                        
            setAddresses(filteredAddress)
            setTotalPagesAddress(response.result.last_page);
            setCurrentPageAddress(response.result.current_page);
            return
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
                return
            }
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelos endereços do fornecedor' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchContacts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await SupplierService.getAllSupplierContact(id, {page, perPage: itemsPerPage}, navigate);
            const filteredContacts = response.result.map(contact => {                
                return {
                    id: contact.id,
                    name: `${contact.name || ''} ${contact.surname || ''}`,
                    number: `${contact.ddd || ''} ${contact.phone || ''}`,
                };
            });
                        
            setContacts(filteredContacts)
            setTotalPagesContact(response.result.last_page);
            setCurrentPageContact(response.result.current_page);
            return
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
                return
            }
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelos contatos do fornecedor' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (address) => {
        navigate(`/fornecedores/editar/${id}/endereco/${address.id}`);
    };

    const handleEditContact = (contact) => {
        navigate(`/fornecedores/${id}/contato/editar/${contact.id}`);
    };

    const handleDeleteContact = (contact) => {
        setContactToDelete(contact);
        setDeleteModalOpenContacts(true);
    };

    const handleDelete = (address) => {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    };

    const handleViewLocations = (address) => {
        navigate(`/fornecedores/detalhes/${id}/enderecos/${address.id}/localizacoes`);
    };

    const confirmDeleteContacts = async () => {
        setLoading(true);
        try {
            await SupplierService.deleteSupplierContact(id, contactToDelete.id, navigate);
            setMessage({ type: 'success', text: 'Contato excluído com sucesso' });
            await fetchContacts();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o contato' });
        } finally {
            setDeleteModalOpenContacts(false);
            setLoading(false);
        }
    };


    const confirmDelete = async () => {
        setLoading(true); 
        try {
            const response = await SupplierService.deleteSupplierAddress(id, addressToDelete.id, navigate);

            setMessage({ type: 'success', text: response.message });
            await fetchAddresses();
            return;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao excluir o endereço';
            setError(errorMessage);
            console.error("Erro capturado no confirmDelete:", error);
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
        },
        {
            icon: faMapMarkerAlt, 
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar localizações de clientes', 
            onClick: handleViewLocations, 
        },
    ];

    const headersContacts = ['ID', 'Responsável', 'Contato'];
    
    const actionsContacts = [
        {
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato de organizações',
            onClick: handleEditContact,
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço da organização',
            onClick: handleDeleteContact,
        }
    ];

    const fetchSupplier = async () => {
        try {
            const response = await SupplierService.getById(id, navigate);
            const supplier = response.result;

            setFormData({
                alias: supplier.alias || '',
                name: supplier.name || '',
                cpf_cnpj: maskCpfCnpj(supplier.cpf_cnpj || '')
            });            
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/fornecedores/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
            }

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
                                <div className="d-flex flex-column col-md-4">
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
                                <div className="d-flex flex-column col-md-4">
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
                                <div className="d-flex flex-column col-md-4">
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
                            </div>

                            <div className='form-row d-flex justify-content-between align-items-center mt-1' style={{marginLeft:0, marginRight:0}}>
                                <h5 className='text-dark font-weight-bold mt-3'>Endereços do Fornecedor</h5>
                                {canAccess('Adicionar endereço ao fornecedor') && (
                                    <Button
                                    text="Adicionar Endereço"
                                    className="btn btn-blue-light fw-semibold"
                                    link={`/fornecedores/${id}/endereco/adicionar`}
                                    />
                                )}
                            </div>
                            <hr />

                            <DynamicTable 
                                headers={headers} 
                                data={addresses} 
                                actions={actions} 
                                currentPage={currentPageAddress}
                                totalPages={totalPagesAddress}
                                onPageChange={fetchAddresses}
                            />

                            <div className='form-row d-flex justify-content-between align-items-center mt-1' style={{marginLeft:0, marginRight:0}}>
                                <h5 className='text-dark font-weight-bold mt-3'>Contatos do Fornecedor</h5>
                                {canAccess('Adicionar endereço ao fornecedor') && (
                                    <Button
                                    text="Adicionar Contato"
                                    className="btn btn-blue-light fw-semibold"
                                    link={`/fornecedores/${id}/contato/adicionar`}
                                    />
                                )}
                            </div>
                            <hr />

                            <DynamicTable 
                                headers={headersContacts} 
                                data={contacts} 
                                actions={actionsContacts} 
                                currentPage={currentPageContact}
                                totalPages={totalPagesContact}
                                onPageChange={fetchAddresses}
                            />


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
            <ConfirmationModal
                open={deleteModalOpenContacts}
                onClose={() => setDeleteModalOpenContacts(false)}
                onConfirm={confirmDeleteContacts}
                itemName={contactToDelete ? `${contactToDelete.name ? contactToDelete.name : ''} ${contactToDelete.surname? contactToDelete.surname : '' }` : ''}
            />
        </MainLayout>
    );
};

export default SupplierDetailsPage;
