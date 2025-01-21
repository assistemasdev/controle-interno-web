import React, { useEffect, useCallback, useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';
import DynamicTable from '../../components/DynamicTable';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useNavigate, useParams } from 'react-router-dom';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { supplierFields } from '../../constants/forms/supplierFields';
import { PAGINATION } from '../../constants/pagination';
import { usePermissions } from '../../hooks/usePermissions';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useForm from '../../hooks/useForm';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import useAddressService from '../../hooks/services/useAddressService';
import useContactService from '../../hooks/services/useContactService';

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { canAccess } = usePermissions();
    const { fetchAll: fetchAllAddresses, remove: removeAddress } = useAddressService(entities.suppliers, id, navigate);
    const { fetchAll: fetchAllContacts, remove: removeContact } = useContactService(entities.suppliers, id, navigate);
    const { fetchById } = useBaseService(entities.suppliers, navigate);
    const { formData, formatData } = useForm(setDefaultFieldValues(supplierFields));
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

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const supplier = await fetchById(id);
            formatData(supplier.result, supplierFields);
            fetchAddress()
            fetchContacts();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao carregar os dados do fornecedor.');
        } finally {
            hideLoader();
        }
    }, [id, currentPageAddress, currentPageContact, fetchById, fetchAllAddresses, showLoader, hideLoader, showNotification]);

    const fetchAddress = useCallback(async (filtersSubmit) => {
        try {
            const addressesResponse = await fetchAllAddresses(filtersSubmit || filtersAddresses);
            
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
            const contactsResponse = await fetchAllContacts(filtersSubmit || filtersContacts);
            
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
    
    const handleConfirmDeleteAddress = async (id) => {
        try {
            showLoader();
            await removeAddress(id);
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
    
    const handleConfirmDeleteContact = async (id) => {
        try {
            showLoader();
            await removeContact(id);
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

    const addressHeaders = useMemo(() => ['ID', 'CEP', 'Rua'], []);
    const addressActions = useMemo(() => [
        {
            id: 'viewAddresses',
            icon: faEye, 
            title: 'Ver endereços de fornecedores',
            buttonClass: 'btn-info',
            permission: 'Visualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/${id}/endereco/${address.id}/detalhes/`),
        },
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/editar/${id}/endereco/${address.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do fornecedor',
            onClick: handleDeleteAddress,
        },

    ], [navigate, id, handleDeleteAddress]);

    const contactHeaders = useMemo(() => ['ID', 'Nome', 'Número'], []);
    const contactActions = useMemo(() => [
        {
            id: 'edit',
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do fornecedor',
            onClick: (contact) => navigate(`/fornecedores/${id}/contato/editar/${contact.id}`),
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Contato',
            buttonClass: 'btn-danger',
            permission: 'Excluir contato do fornecedor',
            onClick: handleDeleteContact,
        }
    ], [navigate, id, handleDeleteContact]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Fornecedor
                </div>
                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <DetailsSectionRenderer
                        sections={supplierFields}
                        formData={formData}
                    />

                    <div className='form-row d-flex justify-content-between align-items-center mt-1'>
                        <h5 className='text-dark font-weight-bold mt-3'>Endereços</h5>
                        {canAccess('Adicionar endereço ao fornecedor') && (
                            <Button
                                text="Adicionar Endereço"
                                className="btn btn-blue-light fw-semibold"
                                link={`/fornecedores/${id}/endereco/adicionar`}
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

                    <div className='form-row d-flex justify-content-between align-items-center mt-1'>
                        <h5 className='text-dark font-weight-bold mt-3'>Contatos</h5>
                        {canAccess('Adicionar contato ao fornecedor') && (
                            <Button
                                text="Adicionar Contato"
                                className="btn btn-blue-light fw-semibold"
                                link={`/fornecedores/${id}/contato/adicionar`}
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

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={() => navigate('/fornecedores')} />
                    </div>
                </div>

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

export default SupplierDetailsPage;
