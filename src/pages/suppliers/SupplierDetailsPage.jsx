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
import useSupplierService from '../../hooks/useSupplierService';
import { supplierFields } from '../../constants/forms/supplierFields';
import { PAGINATION } from '../../constants/pagination';
import { usePermissions } from '../../hooks/usePermissions';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useForm from '../../hooks/useForm';

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { canAccess } = usePermissions();
    const { fetchSupplierById, fetchSupplierAddresses, fetchSupplierContacts, deleteSupplierAddress, deleteSupplierContact } = useSupplierService(navigate);
    const { formData, formatData } = useForm(setDefaultFieldValues(supplierFields));
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    const [currentPageAddress, setCurrentPageAddress] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesAddress, setTotalPagesAddress] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [currentPageContact, setCurrentPageContact] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesContact, setTotalPagesContact] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const supplier = await fetchSupplierById(id);
            const addressesResponse = await fetchSupplierAddresses(id, { page: currentPageAddress });
            const contactsResponse = await fetchSupplierContacts(id, { page: currentPageContact });

            formatData(supplier, supplierFields);
            
            setAddresses(addressesResponse.data.map((address) => ({
                id: address.id,
                zip: address.zip,
                street: address.street
            })));

            setTotalPagesAddress(addressesResponse.last_page);
            setContacts(contactsResponse.data.map((contact) => ({
                id: contact.id,
                name: contact.name,
                number: contact.ddd + '-' + contact.phone
            })));
            setTotalPagesContact(contactsResponse.last_page);
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao carregar os dados do fornecedor.');
        } finally {
            hideLoader();
        }
    }, [id, currentPageAddress, currentPageContact, fetchSupplierById, fetchSupplierAddresses, fetchSupplierContacts, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeleteAddress = (address) => {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    };

    const confirmDeleteAddress = useCallback(async () => {
        showLoader();
        try {
            await deleteSupplierAddress(id, addressToDelete.id);
            fetchData();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao excluir o endereço.');
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [id, addressToDelete, deleteSupplierAddress, fetchData, showLoader, hideLoader, showNotification]);

    const handleDeleteContact = (contact) => {
        setContactToDelete(contact);
        setDeleteModalOpenContacts(true);
    };

    const confirmDeleteContact = useCallback(async () => {
        showLoader();
        try {
            await deleteSupplierContact(id, contactToDelete.id);
            fetchData();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao excluir o contato.');
        } finally {
            setDeleteModalOpenContacts(false);
            hideLoader();
        }
    }, [id, contactToDelete, deleteSupplierContact, fetchData, showLoader, hideLoader, showNotification]);

    const addressHeaders = useMemo(() => ['ID', 'CEP', 'Rua'], []);
    const addressActions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/editar/${id}/endereco/${address.id}`),
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço do fornecedor',
            onClick: handleDeleteAddress,
        },
        {
            icon: faEye, 
            title: 'Ver endereços de fornecedores',
            buttonClass: 'btn-info',
            permission: 'Visualizar endereço do fornecedor',
            onClick: (address) => navigate(`/fornecedores/${id}/endereco/${address.id}/detalhes/`),
        },
    ], [navigate, id, handleDeleteAddress]);

    const contactHeaders = useMemo(() => ['ID', 'Nome', 'Número'], []);
    const contactActions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Contato',
            buttonClass: 'btn-primary',
            permission: 'Atualizar contato do fornecedor',
            onClick: (contact) => navigate(`/fornecedores/${id}/contato/editar/${contact.id}`),
        },
        {
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
                        onPageChange={setCurrentPageAddress}
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
                        onPageChange={setCurrentPageContact}
                    />

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={() => navigate('/fornecedores')} />
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
            </div>
        </MainLayout>
    );
};

export default SupplierDetailsPage;
