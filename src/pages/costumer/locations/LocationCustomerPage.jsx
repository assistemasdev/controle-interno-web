import React, { useState, useEffect, useCallback, useMemo } from "react";
import MainLayout from "../../../layouts/MainLayout";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import DynamicTable from "../../../components/DynamicTable";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";
import useLoader from "../../../hooks/useLoader";
import useNotification from "../../../hooks/useNotification";
import useBaseService from "../../../hooks/services/useBaseService";
import { entities } from "../../../constants/entities";

const LocationCustomerPage = () => {
    const { canAccess } = usePermissions();
    const { id, addressId } = useParams();
    const [name, setName] = useState('');
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { get: fetchAll, del: remove } = useBaseService(navigate);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.type, location.state.message);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

    const handleClearFilters = useCallback(() => {
        setName('');
    }, []);

    const fetchLocations = useCallback(async (page = 1) => {
        try {
            showLoader();

            const response = await fetchAll(entities.customers.addresses.locations(id).get(addressId), { page, perPage: itemsPerPage });

            const formattedLocations = response.result.data.map((loc) => ({
                id: loc.id || '-',
                area: loc.area || '-',
                section: loc.section || '-',
                spot: loc.spot || '-',
            }));

            setLocations(formattedLocations);
            setTotalPages(response.result.last_page);
            setCurrentPage(response.result.current_page);
        } catch (error) {
            showNotification("error", "Erro ao carregar localizações");
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, itemsPerPage, fetchAll, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchLocations();
    }, [id, addressId]);

    const handleEdit = useCallback((location) => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/editar/${location.id}`);
    }, [id, addressId, navigate]);

    const handleDetails = useCallback((location) => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/detalhes/${location.id}`);
    }, [id, addressId, navigate]);

    const handleDelete = useCallback((location) => {
        setLocationToDelete(location);
        setDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        try {
            showLoader();
            await remove(entities.customers.addresses.locations(id).delete(addressId, locationToDelete.id));
            setDeleteModalOpen(false);
            fetchLocations();
        } catch (error) {
            showNotification('error', 'Erro ao excluir a localização');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, locationToDelete, remove, fetchLocations, showLoader, hideLoader, showNotification]);

    const headers = useMemo(() => ["id", "Área", "Seção", "Ponto"], []);

    const actions = useMemo(() => [
        {
            icon: faEdit,
            title: "Editar Localização",
            buttonClass: "btn-primary",
            permission: "Atualizar endereço da cliente",
            onClick: handleEdit,
        },
        {
            icon: faEye,
            title: "Ver Detalhes",
            buttonClass: "btn-info",
            permission: "Ver endereços de clientes",
            onClick: handleDetails,
        },
        {
            icon: faTrash,
            title: "Excluir Localização",
            buttonClass: "btn-danger",
            permission: "Excluir endereço da cliente",
            onClick: handleDelete,
        }
    ], [handleEdit, handleDetails, handleDelete]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Localizações do Cliente
                </div>

                <form
                    className="form-row p-3 mt-2 rounded shadow-sm mb-2"
                    style={{ backgroundColor: "#FFFFFF" }}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="form-group col-md-12">
                        <InputField
                            label="Nome da Localização:"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da localização"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button
                            type="button"
                            text="Filtrar"
                            className="btn btn-blue-light fw-semibold m-1"
                            onClick={fetchLocations}
                        />
                        <Button
                            type="button"
                            text="Limpar filtros"
                            className="btn btn-blue-light fw-semibold m-1"
                            onClick={handleClearFilters}
                        />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Localizações
                    </div>
                    {canAccess("Adicionar localização ao cliente") && (
                        <Button
                            text="Nova Localização"
                            className="btn btn-blue-light fw-semibold"
                            link={`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/adicionar`}
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
                itemName={locationToDelete ? locationToDelete.area : ''}
            />
        </MainLayout>
    );
};

export default LocationCustomerPage;
