import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import OrganizationService from '../../services/OrganizationService';
import DynamicTable from '../../components/DynamicTable';
import { faEdit, faTrash, faEye, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';

const OrganizationDetailsPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId } = useParams();
    const [message, setMessage] = useState(null);
    const { canAccess } = usePermissions();

    // States for organization data
    const [formData, setFormData] = useState({
        name: '',
        alias: '',
        color: '',
        email: '',
    });

    // Pagination states for addresses
    const [addresses, setAddresses] = useState([]);
    const [currentPageAddresses, setCurrentPageAddresses] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPageAddresses, setItemsPerPageAddresses] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPagesAddresses, setTotalPagesAddresses] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    // Pagination states for contacts
    const [contacts, setContacts] = useState([]);
    const [currentPageContacts, setCurrentPageContacts] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPageContacts, setItemsPerPageContacts] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPagesContacts, setTotalPagesContacts] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    const fetchData = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const organizationResponse = await OrganizationService.getById(organizationId, navigate);
            const organization = organizationResponse.result;

            setFormData({
                name: organization.name || '',
                color: organization.color || '',
                active: organization.active ? 'Ativo' : 'Desativado',
            });

            // Fetch paginated data
            fetchAddresses(currentPageAddresses);
            fetchContacts(currentPageContacts);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar os dados da organização' });
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async (page = 1) => {
        try {
            const response = await OrganizationService.allOrganizationAddresses(
                organizationId,
                { page, perPage: itemsPerPageAddresses },
                navigate
            );

            const { data, last_page, current_page } = response.result;
            const filteredAddresses = data.map(address => ({
                id: address.id,
                zip: address.zip,
                street: address.street,
            }));

            setAddresses(filteredAddresses);
            setTotalPagesAddresses(last_page);
            setCurrentPageAddresses(current_page);
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
        }
    };

    const fetchContacts = async (page = 1) => {
        try {
            const response = await OrganizationService.allOrganizationContacts(
                organizationId,
                { page, perPage: itemsPerPageContacts },
                navigate
            );

            const { data, last_page, current_page } = response.result;
            const filteredContacts = data.map(contact => ({
                id: contact.id,
                name: `${contact.name || ''} ${contact.surname || ''}`,
                number: `${contact.ddd || ''} ${contact.phone || ''}`,
            }));

            setContacts(filteredContacts);
            setTotalPagesContacts(last_page);
            setCurrentPageContacts(current_page);
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
        }
    };

    const handleDelete = (address) => {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    };

    const handleDeleteContact = (contact) => {
        setContactToDelete(contact);
        setDeleteModalOpenContacts(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await OrganizationService.deleteOrganizationAddress(organizationId, addressToDelete.id, navigate);
            setMessage({ type: 'success', text: 'Endereço excluído com sucesso' });
            fetchAddresses(currentPageAddresses);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o endereço' });
        } finally {
            setDeleteModalOpen(false);
            setLoading(false);
        }
    };

    const confirmDeleteContacts = async () => {
        setLoading(true);
        try {
            await OrganizationService.deleteOrganizationContact(organizationId, contactToDelete.id, navigate);
            setMessage({ type: 'success', text: 'Contato excluído com sucesso' });
            fetchContacts(currentPageContacts);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir o contato' });
        } finally {
            setDeleteModalOpenContacts(false);
            setLoading(false);
        }
    };

    const handleEdit = (address) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/editar/${address.id}`);
    };
    
    const handleViewDetails = (address) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/detalhes/${address.id}`);
    };
    
    const handleViewLocations = (address) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${address.id}/localizacoes`);
    };
    
    const handleEditContact = (contact) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/contatos/editar/${contact.id}`);
    };
    
    const handleBack = () => {
        navigate('/orgaos/');
    };
    
    const headers = ['ID', 'CEP', 'Rua'];
    const actions = [
        {
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço da organização',
            onClick: handleEdit,
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço da organização',
            onClick: handleDelete,
        },
        {
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Visualizar detalhes do endereço',
            onClick: handleViewDetails,
        },
        {
            icon: faMapMarkerAlt,
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar endereços de organizações',
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
            title: 'Excluir Contato',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato da organização',
            onClick: handleDeleteContact,
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes da Organização
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <h5 className="text-dark font-weight-bold mt-3">Dados da Organização</h5>
                            <hr />

                            <div className="form-row">
                                <div className="d-flex flex-column col-md-4">
                                    <InputField label="Nome" id="name" value={formData.name} disabled={true} />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField label="Cor" id="color" value={formData.color} disabled={true} />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField label="Status" id="status" value={formData.active} disabled={true} />
                                </div>
                            </div>

                            <div className="form-row d-flex justify-content-between align-items-center mt-1">
                                <h5 className="text-dark font-weight-bold mt-3">Endereços da Organização</h5>
                                {canAccess('Adicionar endereço') && (
                                    <Button
                                        text="Adicionar Endereço"
                                        className="btn btn-blue-light fw-semibold"
                                        link={`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/adicionar`}
                                    />
                                )}
                            </div>
                            <hr />

                            <DynamicTable
                                headers={headers}
                                data={addresses}
                                actions={actions}
                                currentPage={currentPageAddresses}
                                totalPages={totalPagesAddresses}
                                onPageChange={fetchAddresses}
                            />

                            <div className="form-row d-flex justify-content-between align-items-center mt-1">
                                <h5 className="text-dark font-weight-bold mt-3">Contatos da Organização</h5>
                                {canAccess('Adicionar contatos de organizações') && (
                                    <Button
                                        text="Adicionar Contato"
                                        className="btn btn-blue-light fw-semibold"
                                        link={`/orgaos/detalhes/${applicationId}/${organizationId}/contatos/adicionar`}
                                    />
                                )}
                            </div>
                            <hr />

                            <DynamicTable
                                headers={headersContacts}
                                data={contacts}
                                actions={actionsContacts}
                                currentPage={currentPageContacts}
                                totalPages={totalPagesContacts}
                                onPageChange={fetchContacts}
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
                itemName={contactToDelete ? `${contactToDelete.name}` : ''}
            />
        </MainLayout>
    );
};

export default OrganizationDetailsPage;
