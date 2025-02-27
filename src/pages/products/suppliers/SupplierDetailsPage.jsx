import React, { useEffect, useCallback, useState, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import DynamicTable from '../../../components/DynamicTable';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';
import { faEdit, faTrash, faEye, faUndo } from '@fortawesome/free-solid-svg-icons';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import { supplierFields } from '../../../constants/forms/supplierFields';
import { PAGINATION } from '../../../constants/pagination';
import { usePermissions } from '../../../hooks/usePermissions';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useForm from '../../../hooks/useForm';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import useAction from '../../../hooks/useAction';
import PageHeader from '../../../components/PageHeader';
import ListHeader from '../../../components/ListHeader';
import { maskCep, maskCpfCnpj} from '../../../utils/maskUtils';

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { canAccess } = usePermissions();
    const { 
        getByColumn:fetchById,
        get: fetchAllAddresses, 
        get: fetchAllContacts, 
    } = useBaseService(navigate);
    const { formData, formatData, setFormData } = useForm(setDefaultFieldValues(supplierFields));
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

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const supplier = await fetchById(entities.suppliers.getByColumn(id));
            formatData(supplier.result, supplierFields);
            setFormData((prev) => ({
                ...prev,
                cpf_cnpj: maskCpfCnpj(supplier.result.cpf_cnpj)
            }))
            fetchAddress()
            fetchContacts();
        } catch (error) {
            console.log(error);
        } finally {
            hideLoader();
        }
    }, [id, currentPageAddress, currentPageContact, fetchById, fetchAllAddresses, showLoader, hideLoader, showNotification]);

    const fetchAddress = useCallback(async (filtersSubmit) => {
        try {
            const addressesResponse = await fetchAllAddresses(entities.suppliers.addresses.get(id) ,filtersSubmit || filtersAddresses);
            
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
            const contactsResponse = await fetchAllContacts(entities.suppliers.contacts.get(id), filtersSubmit || filtersContacts);
            
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
    const addressActions = useMemo(() => [
        {
            id: 'viewAddresses',
            icon: faEye, 
            title: 'Ver endereço',
            buttonClass: 'btn-info',
            permission: 'Visualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/${id}/endereco/${address.id}/detalhes/`),
        },
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/editar/${id}/endereco/${address.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do fornecedor',
            onClick: (address) => handleDeleteAddress(address, 'Você tem certeza que deseja excluir: ', entities.suppliers.addresses.delete(id, address.id), fetchAddress),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar',
            buttonClass: 'btn-info',
            permission: '',
            onClick: (address) => handleActivateAddress(address, 'Você tem certeza que deseja ativar: '),
        },

    ], [navigate, id, handleDeleteAddress]);

    const contactHeaders = useMemo(() => ['ID', 'Nome', 'Número'], []);
    const contactActions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do fornecedor',
            onClick: (contact) => navigate(`/fornecedores/${id}/contato/editar/${contact.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato do fornecedor',
            onClick: (contact) => handleDeleteContact(contact, 'Você tem certeza que deseja excluir: ', entities.suppliers.contacts.delete(id, contact.id), fetchContacts),
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Contato',
            buttonClass: 'btn-info',
            permission: '',
            onClick: (contact) => handleActivateContact(contact, 'Você tem certeza que deseja ativar: '),
        },
    ], [navigate, id, handleDeleteContact]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Fornecedor" showBackButton={true} backUrl="/fornecedores/" /> 
            <div className="container-fluid p-1">
                <DetailsSectionRenderer
                    sections={supplierFields}
                    formData={formData}
                />

                <ListHeader
                    title='Endereços'
                    buttonText="Adicionar Endereço"
                    buttonLink={`/fornecedores/${id}/endereco/adicionar`}
                    canAccess={canAccess}
                    permission="Adicionar endereço ao fornecedor"
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
                    title='Contatos'
                    buttonText="Adicionar Contato"
                    buttonLink={`/fornecedores/${id}/contato/adicionar`}
                    canAccess={canAccess}
                    permission="Adicionar contato ao fornecedor"
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

export default SupplierDetailsPage;
