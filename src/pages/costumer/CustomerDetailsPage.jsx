import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import CustomerService from '../../services/CustomerService';
import { maskCpfCnpj, maskCep } from '../../utils/maskUtils';
import DynamicTable from '../../components/DynamicTable';
import { faEdit, faTrash, faEye, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';

const CustomerDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const { canAccess } = usePermissions();
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: ''
    });
    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async (page = 1) => {
        setLoading(true);
        setMessage(null);
        try {
            const [customerResponse, addressesResponse, contactsResponse] = await Promise.all([
                CustomerService.getById(id, navigate),
                CustomerService.getAllCustomerAddress(id, { page, perPage: PAGINATION.DEFAULT_PER_PAGE }, navigate),
                CustomerService.getAllCustomerContact(id, { page, perPage: PAGINATION.DEFAULT_PER_PAGE }, navigate)
            ]);
            const customer = customerResponse.result;
            setFormData({
                alias: customer.alias || '',
                name: customer.name || '',
                cpf_cnpj: maskCpfCnpj(customer.cpf_cnpj || '')
            });
            setAddresses(addressesResponse.result.data.map(address => ({
                id: address.id,
                zip: maskCep(address.zip),
                street: address.street
            })));

            
            setContacts(contactsResponse.result.data.map(contact => ({
                id: contact.id,
                name: `${contact.name || ''} ${contact.surname || ''}`,
                number: `${contact.ddd || ''} ${contact.phone || ''}`
            })));
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar os dados do cliente' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = (address) => {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    };

    const handleDeleteContact = (contact) => {
        setContactToDelete(contact);
        setDeleteModalOpenContacts(true);
    };

    const confirmDeleteAddress = async () => {
        setLoading(true);
        try {
            await CustomerService.deleteCustomerAddress(id, addressToDelete.id, navigate);
            setMessage({ type: 'success', text: 'Endereço excluído com sucesso' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o endereço' });
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const confirmDeleteContact = async () => {
        setLoading(true);
        try {
            await CustomerService.deleteCustomerContact(id, contactToDelete.id, navigate);
            setMessage({ type: 'success', text: 'Contato excluído com sucesso' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o contato' });
        } finally {
            setDeleteModalOpenContacts(false);
            setLoading(false);
        }
    };

    
    const handleViewLocations = (address) => {
        navigate(`/clientes/detalhes/${id}/enderecos/${address.id}/localizacoes`);
    };

    const handleBack = () => {
        navigate('/clientes/');
    };

    const addressHeaders = ['ID', 'CEP', 'Rua'];
    const addressActions = [
        {
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do cliente',
            onClick: (address) => navigate(`/clientes/${id}/endereco/editar/${address.id}`)
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do cliente',
            onClick: handleDeleteAddress
        },
        {
            icon: faEye, 
            title: 'Ver detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver endereços de clientes', 
            onClick: (address) => navigate(`/clientes/${id}/endereco/${address.id}/detalhes`)
        },
        {
            icon: faMapMarkerAlt, 
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar localizações de clientes', 
            onClick: handleViewLocations, 
        },
    ];

    const contactHeaders = ['ID', 'Nome', 'Telefone'];
    const contactActions = [
        {
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do cliente',
            onClick: (address) => navigate(`/clientes/${id}/contato/editar/${address.id}`)
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato do cliente',
            onClick: handleDeleteContact
        }
    ];


    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-4">
                <CircularProgress size={50} />
            </div>
        );
    }

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Cliente
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    <h5 className="text-dark font-weight-bold mt-3">Dados do Cliente</h5>
                    <hr />

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Apelido:"
                                type="text"
                                id="alias"
                                value={formData.alias}
                                disabled
                            />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="Nome:"
                                type="text"
                                id="name"
                                value={formData.name}
                                disabled
                            />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField
                                label="CPF/CNPJ:"
                                type="text"
                                id="cpf_cnpj"
                                value={formData.cpf_cnpj}
                                disabled
                            />
                        </div>
                    </div>

                    <div className='form-row d-flex justify-content-between align-items-center mt-1' style={{marginLeft:0, marginRight:0}}>
                        <h5 className='text-dark font-weight-bold mt-3'>Endereços do Cliente</h5>
                        {canAccess('Adicionar endereço ao cliente') && (
                            <Button
                            text="Adicionar Endereço"
                            className="btn btn-blue-light fw-semibold"
                            link={`/clientes/${id}/endereco/adicionar`}
                            />
                        )}
                    </div>
                    <hr />
                    <DynamicTable
                        headers={addressHeaders}
                        data={addresses}
                        actions={addressActions}
                        currentPage={1}
                        totalPages={1}
                        onPageChange={() => {}}
                    />

                    <div className='form-row d-flex justify-content-between align-items-center mt-1' style={{marginLeft:0, marginRight:0}}>
                        <h5 className="text-dark font-weight-bold mt-3">Contatos do Cliente</h5>
                        {canAccess('Adicionar contatos de cliente') && (
                            <Button
                            text="Adicionar Contato"
                            className="btn btn-blue-light fw-semibold"
                            link={`/clientes/${id}/contato/adicionar`}
                            />
                        )}
                    </div>
                    <hr />
                    <DynamicTable headers={contactHeaders} data={contacts} actions={contactActions} />

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </div>
            </div>

            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteAddress}
                itemName={addressToDelete ? addressToDelete.street : ''}
                onPageChange={fetchData}
            />

            <ConfirmationModal
                open={deleteModalOpenContacts}
                onClose={() => setDeleteModalOpenContacts(false)}
                onConfirm={confirmDeleteContact}
                itemName={contactToDelete ? contactToDelete.name : ''}
                onPageChange={fetchData}
            />
        </MainLayout>
    );
};

export default CustomerDetailsPage;
