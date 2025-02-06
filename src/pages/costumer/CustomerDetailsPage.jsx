import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import { faEdit, faTrash, faEye, faMapMarkerAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
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
import PageHeader from '../../components/PageHeader';
import ListHeader from '../../components/ListHeader';
import useAction from '../../hooks/useAction';
import { maskCep } from '../../utils/maskUtils'
const CustomerDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { 
        get: fetchAllAddresses, 
        getByColumn: fetchById,
        get: fetchAllContacts, 
    } = useBaseService(navigate);
    const { formData, setFormData } = useForm(setDefaultFieldValues(editCustomerFields));
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
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

    const { 
        openModalConfirmation: openModalConfirmationContact, 
        action: actionContact, 
        handleActivate: handleActivateContact, 
        handleDelete: handleDeleteContact, 
        handleConfirmAction: handleConfirmActionContact, 
        handleCancelConfirmation: handleCancelConfirmationContact, 
        selectedItem: selectedContact
    } = useAction(navigate); 

    const { 
        openModalConfirmation: openModalConfirmationAddress, 
        action: actionAddress, 
        handleActivate: handleActivateAddress, 
        handleDelete: handleDeleteAddress, 
        handleConfirmAction: handleConfirmActionAddress, 
        handleCancelConfirmation: handleCancelConfirmationAddress, 
        selectedItem: selectedAddress
    } = useAction(navigate); 

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
                zip: maskCep(address.zip),
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
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do cliente',
            onClick: (address) => handleDeleteAddress(address, 'Você tem certeza que deseja excluir: ', entities.customers.addresses.delete(id, address.id), fetchAddress),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Endereço',
            buttonClass: 'btn-info',
            permission: '',
            onClick: (address) => handleActivateAddress(address, 'Você tem certeza que deseja ativar: '),
        },
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
            onClick: (contact) => handleDeleteContact(contact, 'Você tem certeza que deseja excluir: ', entities.customers.contacts.delete(id, contact.id), fetchContacts),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Contato',
            buttonClass: 'btn-info',
            permission: '',
            onClick: (contact) => handleActivateContact(contact, 'Você tem certeza que deseja ativar: '),
        },
    ], [handleDeleteContact]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Cliente" showBackButton={true} backUrl='/clientes/'/>
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={editCustomerFields} formData={formData}/>
                
                <ListHeader
                    title='Endereços do Cliente'
                    buttonText="Adicionar Endereço"
                    buttonLink={`/clientes/${id}/endereco/adicionar`}
                    canAccess={canAccess}
                    permission="Adicionar endereço ao cliente"
                />

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

                <ListHeader
                    title='Contatos do Cliente'
                    buttonText="Adicionar Contato"
                    buttonLink={`/clientes/${id}/contato/adicionar`}
                    canAccess={canAccess}
                    permission="Adicionar contatos de cliente"
                />

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
                    onConfirm={handleConfirmActionAddress}
                    itemName={selectedAddress ? `${selectedAddress.street} - ${selectedAddress.zip}` : ''}
                    text={actionAddress.text}
                />

                <ConfirmationModal
                    open={openModalConfirmationContact}
                    onClose={handleCancelConfirmationContact}
                    onConfirm={handleConfirmActionContact}
                    itemName={selectedContact ? selectedContact.name : ''}
                    text={actionContact.text}
                />
            </div>
        </MainLayout>
    );
};

export default CustomerDetailsPage;
