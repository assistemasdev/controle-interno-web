import React, { useState, useEffect, useCallback } from 'react';
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
import useCustomerService from '../../hooks/useCustomerService';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';
import { editCustomerFields } from '../../constants/forms/customerFields';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const CustomerDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { fetchCustomerById, fetchCustomerAddresses, fetchCustomerContacts, deleteAddress, deleteContact } = useCustomerService(navigate);
    const { formData, setFormData } = useForm(setDefaultFieldValues(editCustomerFields));
    const [addresses, setAddresses] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalOpenContacts, setDeleteModalOpenContacts] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isAddressDelete, setIsAddressDelete] = useState(false);

    const fetchData = async () => {
        showLoader();
        try {
            const customerResponse = await fetchCustomerById(id);
            setFormData(customerResponse);

            const addressesResponse = await fetchCustomerAddresses(id, { page: 1, perPage: PAGINATION.DEFAULT_PER_PAGE });
            setAddresses(addressesResponse.data.map((address) => ({
                id: address.id,
                zip: address.zip,
                street: address.street
            })));

            const contactsResponse = await fetchCustomerContacts(id, { page: 1, perPage: PAGINATION.DEFAULT_PER_PAGE });
            setContacts(contactsResponse.data.map((contact) => ({
                id: contact.id,
                name: contact.name,
                number: contact.ddd + '-' + contact.phone            
            })));
        } catch (error) {
            console.log(error)
            showNotification('Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = useCallback((item, isAddress) => {
        setItemToDelete(item);
        setIsAddressDelete(isAddress);
        if (isAddress) setDeleteModalOpen(true);
        else setDeleteModalOpenContacts(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        showLoader();
        try {
            if (isAddressDelete) {
                await deleteAddress(id, itemToDelete.id);
                fetchData()
            } else {
                await deleteContact(id, itemToDelete.id);
                fetchData()
            }
        } catch (error) {
            console.log(error)
            showNotification('Erro ao excluir.');
        } finally {
            setDeleteModalOpen(false);
            setDeleteModalOpenContacts(false);
            hideLoader();
        }
    }, [isAddressDelete, itemToDelete, id, deleteAddress, deleteContact, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate('/clientes/');
    }, [navigate]);

    const addressActions = useCallback([
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
            onClick: (item) => handleDelete(item, true),
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
    ], [handleDelete]);

    const contactActions = useCallback([
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
            onClick: (item) => handleDelete(item, false),

        }
    ], [handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">Detalhes do Cliente</div>

                <DetailsSectionRenderer sections={editCustomerFields} formData={formData} />
                
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
                    headers={['ID', 'CEP', 'Rua']}
                    data={addresses}
                    actions={addressActions}
                    title="Endereços do Cliente"
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
                    headers={['ID', 'Nome', 'Telefone']}
                    data={contacts}
                    actions={contactActions}
                    title="Contatos do Cliente"
                />

                <div className="mt-3 d-flex gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
        
                <ConfirmationModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    itemName={itemToDelete?.street || ''}
                />

                <ConfirmationModal
                    open={deleteModalOpenContacts}
                    onClose={() => setDeleteModalOpenContacts(false)}
                    onConfirm={confirmDelete}
                    itemName={itemToDelete?.name || ''}
                />
            </div>
        </MainLayout>
    );
};

export default CustomerDetailsPage;
