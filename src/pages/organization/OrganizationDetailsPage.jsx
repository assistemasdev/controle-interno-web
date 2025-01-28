import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import '../../assets/styles/custom-styles.css';
import DynamicTable from '../../components/DynamicTable';
import { faEdit, faTrash, faEye, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { editOrganizationFields } from '../../constants/forms/organizationFields';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const OrganizationDetailsPage = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchById,
        get: fetchAllAddresses, 
        del: removeAddress
    } = useBaseService(navigate);
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(editOrganizationFields));
    const [addresses, setAddresses] = useState([]);
    const [currentPageAddresses, setCurrentPageAddresses] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPageAddresses, setItemsPerPageAddresses] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPagesAddresses, setTotalPagesAddresses] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [openModalConfirmationAddress, setOpenModalConfirmationAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [filtersAddresses, setFiltersAddresses] = useState({
        deleted_at:false,
        page: 1,
        perPage:itemsPerPageAddresses
    });
    const [actionAddress, setActionAddress] = useState({
        action: '',
        text: '',
    });

    const fetchAddresses = useCallback(async (filtersSubmit) => {
        try {
            const response = await fetchAllAddresses(entities.organizations.addresses.get(organizationId), filtersSubmit || filtersAddresses);
            setAddresses(response.result.data.map((address) => ({
                id: address.id,
                zip: address.zip,
                street: address.street,
                deleted_at: address.deleted_at ? 'deleted-' + address.deleted_at : 'deleted-null'
            })));
            setTotalPagesAddresses(response.result.last_page);
            setCurrentPageAddresses(response.result.current_page);
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao carregar endereços.');
        }
    }, [fetchAllAddresses, itemsPerPageAddresses, organizationId]);

    const fetchData = useCallback(async () => {
        showLoader();

        try {
            const response = await fetchById(entities.organizations.getByColumn(organizationId));
            console.log(response)
            formatData(response.result, editOrganizationFields)
            setFormData(prev => ({
                ...prev,
                active: response.result.active ? 'Ativo' : 'Desativado',
            }));

            await fetchAddresses(currentPageAddresses);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [fetchById, fetchAddresses, currentPageAddresses]);

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
            await removeAddress(entities.organizations.addresses.delete(organizationId, id));
            setOpenModalConfirmationAddress(false);  
            fetchAddresses();
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

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    const actions = useMemo(() => [
        {
            id:'viewDetails',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Visualizar detalhes do endereço',
            onClick: (address) => navigate(`/organizacoes/detalhes/${organizationId}/enderecos/detalhes/${address.id}`),
        },
        {
            id:'viewLocations',
            icon: faMapMarkerAlt,
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar endereços de organizações',
            onClick: (address) => navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${address.id}/localizacoes`),
        },
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço da organização',
            onClick: (address) => navigate(`/organizacoes/detalhes/${organizationId}/enderecos/editar/${address.id}`),
        },
        {
            id:'delete',
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço da organização',
            onClick: handleDeleteAddress,
        }
        
    ], [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes da Organização
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <>
                        <DetailsSectionRenderer sections={editOrganizationFields} formData={formData} />

                        <div className="form-row d-flex justify-content-between align-items-center mt-1">
                            <h5 className="text-dark font-weight-bold mt-3">Endereços da Organização</h5>
                            {canAccess('Adicionar endereço') && (
                                <Button
                                    text="Adicionar Endereço"
                                    className="btn btn-blue-light fw-semibold"
                                    link={`/organizacoes/detalhes/${organizationId}/enderecos/adicionar`}
                                />
                            )}
                        </div>
                        
                        <hr />
                        <DynamicTable
                            headers={['ID', 'CEP', 'Rua']}
                            data={addresses}
                            actions={actions}
                            currentPage={currentPageAddresses}
                            totalPages={totalPagesAddresses}
                            onPageChange={fetchAddresses}
                            filters={filtersAddresses}
                            setFilters={setFiltersAddresses}
                        />

                        <div className="mt-3 d-flex gap-2">
                            <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={() => navigate('/organizacoes/')} />
                        </div>
                    </>
                </div>
            </div>

            <ConfirmationModal
                open={openModalConfirmationAddress}
                onClose={handleCancelConfirmationAddress}
                onConfirm={() => actionAddress.action == 'delete'? handleConfirmDeleteAddress(selectedAddress.id) : console.log('oi')}
                itemName={selectedAddress ? selectedAddress.street : ''}
                text={actionAddress.text}
            />
        </MainLayout>
    );
};

export default OrganizationDetailsPage;
