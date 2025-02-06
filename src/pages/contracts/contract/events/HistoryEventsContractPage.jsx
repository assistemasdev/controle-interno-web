import React, { useEffect, useCallback, useState, useMemo } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import { useParams } from 'react-router-dom';
import Timeline from '../../../../components/Timeline';
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import Button from '../../../../components/Button';
import PageHeader from '../../../../components/PageHeader';

const HistoryEventsContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        get: fetchContractEventTypes,
        get: fetchEventsContract,
        del: deleteEventContract
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const [contractEvents, setContractEvents] = useState([])
    const { id } = useParams();
    const [action, setAction] = useState({
        action: '',
        text: '',
    });
    const [selectedEvent, setSelectedEvent] = useState(null);  
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false); 
    
    const handleEdit = (event) => {
        navigate(`/contratos/${id}/eventos/${event.id}/editar`)
    };

    const handleActivate = (contract, action) => {
        setSelectedEvent(contract); 
        setAction({
            action,
            text:'Você tem certeza que deseja ativar: '
        })
        setOpenModalConfirmation(true);  
    };

    const handleDelete = (contract, action) => {
        setSelectedEvent(contract);  
        setAction({
            action,
            text:'Você tem certeza que deseja excluir: '
        })
        setOpenModalConfirmation(true);  
    };
    
    const handleConfirmDelete = async (eventId) => {
        try {
            showLoader();
            await deleteEventContract(entities.contracts.events.delete(id, eventId));
            setOpenModalConfirmation(false);  
            fetchData();
        } catch (error) {
            console.log(error);
            setOpenModalConfirmation(false);  
        } finally {
            hideLoader();
        }    
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);  
    };

    const actions = useMemo(() => [
        {
            id:'edit',
            icon: faEdit,
            title: 'Editar Evento',
            buttonClass: 'btn-primary',
            permission: 'Atualizar eventos de contratos',
            onClick: handleEdit
        },
        {
            id: 'delete',
            icon: faTrash,
            title: 'Excluir Evento',
            buttonClass: 'btn-danger',
            permission: 'Excluir eventos de contratos',
            onClick: handleDelete
        },
        {
            id: 'activate',
            icon: faUndo,
            title: 'Ativar Evento',
            buttonClass: 'btn-info',
            permission: 'Atualizar eventos de contratos',
            onClick: handleActivate,
        },
    ], []);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            showLoader();
            const [
                contractEventsResponse,
                contractEventTypesResponse
            ] = await Promise.all([
                fetchEventsContract(entities.contracts.events.get(id)),
                fetchContractEventTypes(entities.contracts.eventsTypes.get())
            ]);
            
            const eventTypesMap = mapEventTypes(contractEventTypesResponse.result.data);
            const filteredContractEvents = transformContractEvents(contractEventsResponse.result.data, eventTypesMap);
            setContractEvents(filteredContractEvents);

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    };

    const mapEventTypes = useCallback((eventTypesData) => {
        return Object.fromEntries(
            eventTypesData.map((eventType) => [
                eventType.id,
                { name: eventType.name, description: eventType.description }
            ])
        );   
    }, []);

    const transformContractEvents = useCallback((contractEvents, eventTypesMap) => {
            return contractEvents.map((event) => ({
                id: event.id,
                title: eventTypesMap[event.contract_event_type_id].name || "Nome não informado",
                description: eventTypesMap[event.contract_event_type_id].description || "Descrição não informada",
                date: event.created_at,
                deleted_at: event.deleted_at ? 'deleted-' + event.deleted_at : 'deleted-null'
            }));
        }, []);

    const handleBack = () => {
        navigate(`/contratos/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Histórico de Eventos do Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <Timeline data={contractEvents} actions={actions}/>

                <ConfirmationModal
                    open={openModalConfirmation}
                    onClose={handleCancelConfirmation}
                    onConfirm={() => action.action == 'delete'? handleConfirmDelete(selectedEvent.id) : console.log('oi')}
                    itemName={selectedEvent ? `${selectedEvent.title}` : ''}
                    text={action.text}
                />
            </div>
        </MainLayout>
    );
};

export default HistoryEventsContractPage;
