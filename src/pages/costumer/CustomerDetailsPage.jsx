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

    // Form data
    const [formData, setFormData] = useState({
        alias: '',
        name: '',
        cpf_cnpj: ''
    });

    // Pagination states for addresses
    const [addresses, setAddresses] = useState([]);
    const [currentPageAddresses, setCurrentPageAddresses] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesAddresses, setTotalPagesAddresses] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    // Pagination states for contacts
    const [contacts, setContacts] = useState([]);
    const [currentPageContacts, setCurrentPageContacts] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesContacts, setTotalPagesContacts] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const customerResponse = await CustomerService.getById(id, navigate);
            const customer = customerResponse.result;

            setFormData({
                alias: customer.alias || '',
                name: customer.name || '',
                cpf_cnpj: maskCpfCnpj(customer.cpf_cnpj || '')
            });

            // Fetch addresses and contacts with pagination
            fetchAddresses(currentPageAddresses);
            fetchContacts(currentPageContacts);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar os dados do cliente' });
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async (page = 1) => {
        try {
            const response = await CustomerService.getAllCustomerAddress(
                id,
                { page, perPage: PAGINATION.DEFAULT_PER_PAGE },
                navigate
            );

            const { data, last_page, current_page } = response.result;
            setAddresses(
                data.map(address => ({
                    id: address.id,
                    zip: maskCep(address.zip),
                    street: address.street
                }))
            );
            setCurrentPageAddresses(current_page);
            setTotalPagesAddresses(last_page);
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar endereços.' });
        }
    };

    const fetchContacts = async (page = 1) => {
        try {
            const response = await CustomerService.getAllCustomerContact(
                id,
                { page, perPage: PAGINATION.DEFAULT_PER_PAGE },
                navigate
            );

            const { data, last_page, current_page } = response.result;
            setContacts(
                data.map(contact => ({
                    id: contact.id,
                    name: `${contact.name || ''} ${contact.surname || ''}`,
                    number: `${contact.ddd || ''} ${contact.phone || ''}`
                }))
            );
            setCurrentPageContacts(current_page);
            setTotalPagesContacts(last_page);
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar contatos.' });
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
            fetchAddresses(currentPageAddresses);
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
            fetchContacts(currentPageContacts);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o contato' });
        } finally {
            setDeleteModalOpenContacts(false);
            setLoading(false);
        }
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
            onClick: (address) => navigate(`/clientes/detalhes/${id}/enderecos/${address.id}/localizacoes`)
        },
    ];

    const contactHeaders = ['ID', 'Nome', 'Telefone'];
    const contactActions = [
        {
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do cliente',
            onClick: (contact) => navigate(`/clientes/${id}/contato/editar/${contact.id}`)
        },
        {
            icon: faTrash,
            title: 'Excluir Contato',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato do cliente',
            onClick: handleDeleteContact
        }
    ];

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
                            <InputField label="Apelido:" id="alias" value={formData.alias} disabled />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField label="Nome:" id="name" value={formData.name} disabled />
                        </div>
                        <div className="d-flex flex-column col-md-4">
                            <InputField label="CPF/CNPJ:" id="cpf_cnpj" value={formData.cpf_cnpj} disabled />
                        </div>
                    </div>

                    <div className="form-row d-flex justify-content-between align-items-center mt-1">
                        <h5 className="text-dark font-weight-bold mt-3">Endereços do Cliente</h5>
                        {canAccess('Adicionar endereço ao cliente') && (
                            <Button text="Adicionar Endereço" className="btn btn-blue-light fw-semibold" link={`/clientes/${id}/endereco/adicionar`} />
                        )}
                    </div>
                    <hr />
                    <DynamicTable
                        headers={addressHeaders}
                        data={addresses}
                        actions={addressActions}
                        currentPage={currentPageAddresses}
                        totalPages={totalPagesAddresses}
                        onPageChange={(page) => {
                            setCurrentPageAddresses(page);
                            fetchAddresses(page);
                        }}
                    />

                    <div className="form-row d-flex justify-content-between align-items-center mt-1">
                        <h5 className="text-dark font-weight-bold mt-3">Contatos do Cliente</h5>
                        {canAccess('Adicionar contatos de cliente') && (
                            <Button text="Adicionar Contato" className="btn btn-blue-light fw-semibold" link={`/clientes/${id}/contato/adicionar`} />
                        )}
                    </div>
                    <hr />
                    <DynamicTable
                        headers={contactHeaders}
                        data={contacts}
                        actions={contactActions}
                        currentPage={currentPageContacts}
                        totalPages={totalPagesContacts}
                        onPageChange={(page) => {
                            setCurrentPageContacts(page);
                            fetchContacts(page);
                        }}
                    />

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
            />

            <ConfirmationModal
                open={deleteModalOpenContacts}
                onClose={() => setDeleteModalOpenContacts(false)}
                onConfirm={confirmDeleteContact}
                itemName={contactToDelete ? contactToDelete.name : ''}
            />
        </MainLayout>
    );
};

export default CustomerDetailsPage;
