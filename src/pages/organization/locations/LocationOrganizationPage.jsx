import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../../layouts/MainLayout";
import MyAlert from "../../../components/MyAlert";
import DynamicTable from "../../../components/DynamicTable";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import { CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import useOrganizationService from "../../../hooks/useOrganizationService";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import { PAGINATION } from "../../../constants/pagination";

const LocationOrganizationPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { applicationId, organizationId, addressId } = useParams();
    const {
        fetchOrganizationLocations,
        deleteOrganizationLocation,
    } = useOrganizationService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    const [locations, setLocations] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    const fetchLocations = useCallback(async (page = currentPage) => {
        try {
            showLoader();
            const response = await fetchOrganizationLocations(organizationId, addressId, {
                page,
                perPage: itemsPerPage,
            });

            const { data, last_page, current_page } = response;

            const formattedLocations = data.map((loc) => ({
                id: loc.id,
                area: loc.area,
                section: loc.section,
                spot: loc.spot,
            }));

            setLocations(formattedLocations);
            setTotalPages(last_page);
            setCurrentPage(current_page);
        } catch (error) {
            showNotification("error", "Erro ao carregar localizações");
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [fetchOrganizationLocations, organizationId, addressId, itemsPerPage, currentPage, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchLocations();
    }, [organizationId, addressId]);

    const handleEdit = (location) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${addressId}/localizacoes/editar/${location.id}`);
    };

    const handleDetails = (location) => {
        navigate(`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${addressId}/localizacoes/detalhes/${location.id}`);
    };

    const handleDelete = (location) => {
        setLocationToDelete(location);
        setDeleteModalOpen(true);
    };

    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await deleteOrganizationLocation(organizationId, addressId, locationToDelete.id);
            setDeleteModalOpen(false);
            fetchLocations();
        } catch (error) {
            showNotification("error", "Erro ao excluir a localização");
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [deleteOrganizationLocation, organizationId, addressId, locationToDelete, fetchLocations, showLoader, hideLoader, showNotification]);

    const headers = ["id", "Área", "Seção", "Ponto"];

    const actions = [
        {
            icon: faEdit,
            title: "Editar Localização",
            buttonClass: "btn-primary",
            permission: "Atualizar endereço da organização",
            onClick: handleEdit,
        },
        {
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver endereços de organizações",
            onClick: handleDetails,
        },
        {
            icon: faTrash,
            title: "Excluir Localização",
            buttonClass: "btn-danger",
            permission: "Excluir endereço da organização",
            onClick: handleDelete,
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Localizações da Organização
                </div>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Localizações
                    </div>
                    {canAccess("Adicionar endereço à organização") && (
                        <Button
                            text="Nova Localização"
                            className="btn btn-blue-light fw-semibold"
                            link={`/orgaos/detalhes/${applicationId}/${organizationId}/enderecos/${addressId}/localizacoes/adicionar`}
                        />
                    )}
                </div>

                <DynamicTable
                    headers={headers}
                    data={locations}
                    actions={actions}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={fetchLocations}
                />
                
            </div>

            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={locationToDelete ? locationToDelete.area : ""}
            />
        </MainLayout>
    );
};

export default LocationOrganizationPage;
