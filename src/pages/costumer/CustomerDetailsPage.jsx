import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import '../../assets/styles/custom-styles.css';
import { faEdit, faTrash, faEye, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicTable from '../../components/DynamicTable';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';
import { editCustomerFields } from '../../constants/forms/customerFields';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { entities } from '../../constants/entities';
import useBaseService from '../../hooks/services/useBaseService';

const CustomerDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { 
        get: fetchAllAddresses, 
        getByColumn: fetchById,
        del: removeAddress, 
        get: fetchAllContacts, 
        del: removeContact  
    } = useBaseService(navigate);
    const { formData, setFormData } = useForm(setDefaultFieldValues(editCustomerFields));
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [openModalConfirmationAddress, setOpenModalConfirmationAddress] = useState(false);
    const [openModalConfirmationContact, setOpenModalConfirmationContact] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [currentPageAddress, setCurrentPageAddress] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesAddress, setTotalPagesAddress] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [currentPageContact, setCurrentPageContact] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesContact, setTotalPagesContact] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [filtersAddresses, setFiltersAddresses] = useState({
        deleted_at:false,
        page: 1,
        perPage:totalPagesAddress
    });
    const [filtersContacts, setFiltersContacts] = useState({
        deleted_at:false,
        page: 1,
        perPage:totalPagesContact
    });
    const [actionAddress, setActionAddress] = useState({
        action: '',
        text: '',
    });
    const [actionContact, setActionContact] = useState({
        action: '',
        text: '',
    });

    const fetchData = async () => {
        showLoader();
        try {
            const customerResponse = await fetchById(entities.customers.getByColumn(id));
            setFormData(customerResponse.result);

            fetchAddress();
            fetchContacts();
        } catch (error) {
            console.log(error)
            showNotification('Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    };

    const fetchAddress = useCallback(async (filtersSubmit) => {
            try {
                const addressesResponse = await fetchAllAddresses(entities.customers.addresses.get(id), filtersSubmit || filtersAddresses);
                setAddresses(addressesResponse.result.data.map((address) => ({
                    id: address.id,
                    zip: address.zip,
                    street: address.street,
                    deleted_at: address.deleted_at ? 'deleted-' + address.deleted_at : 'deleted-null'
                })));
    
                setTotalPagesAddress(addressesResponse.result.last_page);
            } catch (error) {
                console.log(error);
            } finally {
                hideLoader();
            }
        });
    
        const fetchContacts = useCallback(async (filtersSubmit) => {
            try {
                const contactsResponse = await fetchAllContacts(entities.customers.contacts.get(id), filtersSubmit || filtersContacts);
                
                setContacts(contactsResponse.result.data.map((contact) => ({
                    id: contact.id,
                    name: contact.name,
                    number: contact.ddd + '-' + contact.phone,
                    deleted_at: contact.deleted_at ? 'deleted-' + contact.deleted_at : 'deleted-null'
                })));
                setTotalPagesContact(contactsResponse.result.last_page);
            } catch (error) {
                console.log(error);
            } finally {
                hideLoader();
            }
        });

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleActivateAddress = (address, action) => {
        setSelectedAddress(address); 
        setActionAddress({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmationAddress(true);  
    };

    const handleDeleteAddress = (address, action) => {
        setSelectedAddress(address);  
        setActionAddress({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmationAddress(true);  
    };
    
    const handleConfirmDeleteAddress = async (addressId) => {
        try {
            showLoader();
            await removeAddress(entities.customers.addresses.delete(id, addressId));
            setOpenModalConfirmationAddress(false);  
            fetchAddress();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmationAddress(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmationAddress = () => {
        setOpenModalConfirmationAddress(false);  
    };

    const handleActivateContact = (contact, action) => {
        setSelectedContact(contact); 
        setActionContact({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmationContact(true);  
    };

    const handleDeleteContact = (contact, action) => {
        setSelectedContact(contact);  
        setActionContact({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmationContact(true);  
    };
    
    const handleConfirmDeleteContact = async (contactId) => {
        try {
            showLoader();
            await removeContact(entities.customers.contacts.delete(id, contactId));
            setOpenModalConfirmationContact(false);  
            fetchContacts();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmationContact(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmationContact = () => {
        setOpenModalConfirmationContact(false);  
    };

    const handleBack = useCallback(() => {
        navigate('/clientes/');
    }, [navigate]);

    const addressHeaders = useMemo(() => ['ID', 'CEP', 'Rua'], []);
    const contactHeaders = useMemo(() => ['ID', 'Nome', 'Número'], []);
    
    const addressActions = useCallback([
        {
            id:'viewDetails',
            icon: faEye,
            title: 'Ver detalhes',
            buttonClass: 'btn-info',
            permission: 'Ver endereços de clientes',
            onClick: (address) => navigate(`/clientes/${id}/endereco/${address.id}/detalhes`)
        },
        {
            id:'viewLocations',
            icon: faMapMarkerAlt,
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar localizações de clientes',
            onClick: (address) => navigate(`/clientes/detalhes/${id}/enderecos/${address.id}/localizacoes`)
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do cliente',
            onClick: (address) => navigate(`/clientes/${id}/endereco/editar/${address.id}`)
        },
        {
            id:'delete',
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do cliente',
            onClick: handleDeleteAddress,
        }
    ], [handleDeleteAddress]);

    const contactActions = useCallback([
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do cliente',
            onClick: (contact) => navigate(`/clientes/${id}/contato/editar/${contact.id}`)
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Contato',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato do cliente',
            onClick: handleDeleteContact,

        }
    ], [handleDeleteContact]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">Detalhes do Cliente</div>

                <DetailsSectionRenderer sections={editCustomerFields} formData={formData} handleBack={handleBack}/>
                
                <div className="form-row d-flex justify-content-between align-items-center mt-1">
                    <h5 className="text-dark font-weight-bold mt-3">Endereços do Cliente</h5>
                    {canAccess('Adicionar endereço ao cliente') && (
                        <Button
                            text="Adicionar Endereço"
                            className="btn btn-blue-light fw-semibold"
                            link={`/clientes/${id}/endereco/adicionar`}
                        />
                    )}
                </div>

                <DynamicTable
                    headers={addressHeaders}
                    data={addresses}
                    actions={addressActions}
                    currentPage={currentPageAddress}
                    totalPages={totalPagesAddress}
                    onPageChange={fetchAddress}
                    filters={filtersAddresses}
                    setFilters={setFiltersAddresses}
                />


                <div className="form-row d-flex justify-content-between align-items-center mt-1">
                    <h5 className="text-dark font-weight-bold mt-3">Contatos do Cliente</h5>
                    {canAccess('Adicionar contatos de cliente') && (
                        <Button
                            text="Adicionar Contato"
                            className="btn btn-blue-light fw-semibold"
                            link={`/clientes/${id}/contato/adicionar`}
                        />
                    )}
                </div>

                <DynamicTable
                    headers={contactHeaders}
                    data={contacts}
                    actions={contactActions}
                    currentPage={currentPageContact}
                    totalPages={totalPagesContact}
                    onPageChange={fetchContacts}
                    filters={filtersContacts}
                    setFilters={setFiltersContacts}
                />
        
                <ConfirmationModal
                    open={openModalConfirmationAddress}
                    onClose={handleCancelConfirmationAddress}
                    onConfirm={() => actionAddress.action == 'delete'? handleConfirmDeleteAddress(selectedAddress.id) : console.log('oi')}
                    itemName={selectedAddress ? selectedAddress.street : ''}
                    text={actionAddress.text}
                />

                <ConfirmationModal
                    open={openModalConfirmationContact}
                    onClose={handleCancelConfirmationContact}
                    onConfirm={() => actionContact.action == 'delete'? handleConfirmDeleteContact(selectedContact.id) : console.log('oi')}
                    itemName={selectedContact ? selectedContact.number : ''}
                    text={actionContact.text}
                />
            </div>
        </MainLayout>
    );
};

export default CustomerDetailsPage;
