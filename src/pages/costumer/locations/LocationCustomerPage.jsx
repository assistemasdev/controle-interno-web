import React, { useState, useEffect } from "react";
import MainLayout from "../../../layouts/MainLayout";
import MyAlert from "../../../components/MyAlert";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { usePermissions } from "../../../hooks/usePermissions";
import { CircularProgress } from "@mui/material";
import DynamicTable from "../../../components/DynamicTable";
import CustomerService from "../../../services/CustomerService";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";
import { PAGINATION } from "../../../constants/pagination";

const LocationCustomerPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { id, addressId } = useParams();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({ type: location.state.type, message: location.state.message });
        }
    }, [location.state]);

    const handleClearFilters = () => {
        setName('');
    };

    const fetchLocations = async (page = 1) => {
        try {
            setLoading(true);

            const response = await CustomerService.getAllCustomerLocation(id, addressId, { page, perPage: itemsPerPage}, navigate);
            const result = response.result;

            const formattedLocations = result.data.map((loc) => ({
                id: loc.id,
                area: loc.area,
                section: loc.section,
                spot: loc.spot,
            }));

            setLocations(formattedLocations);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            setError("Erro ao carregar localizações");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleEdit = (location) => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/editar/${location.id}`);
    };

    const handleDetails = (location) => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes/detalhes/${location.id}`);
    };

    const handleDelete = (location) => {
        setLocationToDelete(location); 
        setDeleteModalOpen(true); 
    };

    const confirmDelete = async () => {
        try {
            await CustomerService.deleteCustomerLocation(
                id,
                addressId,
                locationToDelete.id
            );
    
            setMessage({ type: 'success', text: 'Localização excluída com sucesso!' });
            setDeleteModalOpen(false);
            fetchLocations(); 
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir a localização' });
            console.error(error);
        }
    };

    const headers = ["id", "Área", "Seção", "Ponto"];

    const actions = [
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
    ];

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
                    {message && (
                        <MyAlert
                            severity={message.type}
                            message={message.text}
                            onClose={() => setMessage("")}
                        />
                    )}
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

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : error ? (
                    <div className="mt-3">
                        <MyAlert notTime={true} severity="error" message={error} />
                    </div>
                ) : (
                    <DynamicTable 
                        headers={headers} 
                        data={locations} 
                        actions={actions}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchLocations}
                    />
                )}
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
