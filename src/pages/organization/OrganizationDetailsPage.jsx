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
import useOrganizationService from '../../hooks/useOrganizationService';
import { editOrganizationFields } from '../../constants/forms/organizationFields';
import DetailsSectionRenderer from '../../components/DetailsSectionRenderer';

const OrganizationDetailsPage = () => {
    const navigate = useNavigate();
    const { applicationId, organizationId } = useParams();
    const { canAccess } = usePermissions();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const {
        fetchOrganizationById,
        fetchOrganizationAddresses,
        deleteOrganizationAddress,
    } = useOrganizationService(navigate);

    const [formData, setFormData] = useState({
        name: '',
        color: '',
        active: '',
    });
    const [addresses, setAddresses] = useState([]);
    const [currentPageAddresses, setCurrentPageAddresses] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPageAddresses, setItemsPerPageAddresses] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPagesAddresses, setTotalPagesAddresses] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const fetchAddresses = useCallback(async (page = 1) => {
        try {
            const response = await fetchOrganizationAddresses(organizationId, { page, perPage: itemsPerPageAddresses });
            setAddresses(response.data.map((address) => ({
                id: address.id,
                zip: address.zip,
                street: address.street,
            })));
            setTotalPagesAddresses(response.last_page);
            setCurrentPageAddresses(response.current_page);
        } catch (error) {
            showNotification('error', 'Erro ao carregar endereços.');
        }
    }, [fetchOrganizationAddresses, itemsPerPageAddresses, organizationId]);

    const fetchData = useCallback(async () => {
        showLoader();

        try {
            const organization = await fetchOrganizationById(organizationId);
            setFormData({
                name: organization.name || '',
                color: organization.color || '',
                active: organization.active ? 'Ativo' : 'Desativado',
            });

            await fetchAddresses(currentPageAddresses);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da organização.');
        } finally {
            hideLoader();
        }
    }, [fetchOrganizationById, fetchAddresses, currentPageAddresses]);

    const confirmDelete = useCallback(async () => {
        showLoader();
        try {
            await deleteOrganizationAddress(organizationId, addressToDelete.id);
            showNotification('success', 'Endereço excluído com sucesso.');
            fetchAddresses(currentPageAddresses);
        } catch (error) {
            showNotification('error', 'Erro ao excluir endereço.');
        } finally {
            setDeleteModalOpen(false);
            hideLoader();
        }
    }, [deleteOrganizationAddress, addressToDelete, currentPageAddresses, fetchAddresses, organizationId]);

    useEffect(() => {
        fetchData();
    }, [organizationId]);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: 'Editar Endereço',
            buttonClass: 'btn-primary',
            permission: 'Atualizar endereço da organização',
            onClick: (address) => navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/editar/${address.id}`),
        },
        {
            icon: faTrash,
            title: 'Excluir Endereço',
            buttonClass: 'btn-danger',
            permission: 'Excluir endereço da organização',
            onClick: (address) => {
                setAddressToDelete(address);
                setDeleteModalOpen(true);
            },
        },
        {
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-info',
            permission: 'Visualizar detalhes do endereço',
            onClick: (address) => navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/detalhes/${address.id}`),
        },
        {
            icon: faMapMarkerAlt,
            title: 'Ver Localizações',
            buttonClass: 'btn-warning',
            permission: 'Listar endereços de organizações',
            onClick: (address) => navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${address.id}/localizacoes`),
        },
    ], [navigate, applicationId, organizationId]);

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
                                    link={`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/adicionar`}
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
                        />

                        <div className="mt-3 d-flex gap-2">
                            <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={() => navigate('/orgaos/')} />
                        </div>
                    </>
                </div>
            </div>

            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={addressToDelete ? addressToDelete.street : ''}
            />
        </MainLayout>
    );
};

export default OrganizationDetailsPage;
