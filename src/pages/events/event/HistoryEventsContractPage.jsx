import React, { useEffect, useCallback, useState, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import { useParams } from 'react-router-dom';
import Timeline from '../../../components/Timeline';
import { faEdit, faTrash, faUndo, faEye } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import PageHeader from '../../../components/PageHeader';

const HistoryEventsContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        get: fetchContractEventTypes,
        get: fetchEventsContract,
        get: fetchEventsAdditives,
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
    }

    const handleViewDetails = (event) => {
        navigate(`/contratos/${id}/eventos/${event.id}/detalhes`)
    }

    const actions = useMemo(() => [
        {
            id: 'view',
            icon: faEye,
            title: 'Ver Detalhes',
            buttonClass: 'btn-secondary',
            permission: 'Visualizar eventos de contratos',
            onClick: handleViewDetails
        },
        // {
        //     id:'edit',
        //     icon: faEdit,
        //     title: 'Editar Evento',
        //     buttonClass: 'btn-primary',
        //     permission: 'Atualizar eventos de contratos',
        //     onClick: handleEdit
        // },
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
                contractEventTypesResponse,
                eventsAdditivesResponse 
            ] = await Promise.all([
                fetchEventsContract(entities.contracts.events.get(id)),
                fetchContractEventTypes(entities.contracts.eventsTypes.get()),
                fetchEventsAdditives(entities.additives.get) 
            ]);
    
            const eventTypesMap = mapEventTypes(contractEventTypesResponse.result.data);
            const additivesMap = mapEventAdditives(eventsAdditivesResponse.result); 
            const filteredContractEvents = transformContractEvents(contractEventsResponse.result.data, eventTypesMap, additivesMap); 
            setContractEvents(filteredContractEvents);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    };

    const mapEventAdditives = useCallback((additivesData) => {
        return additivesData.reduce((acc, additive) => {
            if (!acc[additive.event_id]) {
                acc[additive.event_id] = [];
            }
            acc[additive.event_id].push(additive);
            return acc;
        }, {});
    }, []);

    const mapEventTypes = useCallback((eventTypesData) => {
        return Object.fromEntries(
            eventTypesData.map((eventType) => [
                eventType.id,
                { name: eventType.name, description: eventType.description }
            ])
        );   
    }, []);

    const transformContractEvents = useCallback((contractEvents, eventTypesMap, additivesMap) => {
        return contractEvents.map((event) => {
            const additivesDetails = additivesMap[event.id]
                ? additivesMap[event.id]
                      .map(additive => {
                          const eventTypeName = eventTypesMap[additive.contract_event_type_id]?.name || "Nome não informado";
                          const eventTypeDescription = eventTypesMap[additive.contract_event_type_id]?.description || "Descrição não informada";
                          return `${eventTypeName}: ${eventTypeDescription}`; 
                      })
                      .join('<br />')  
                : '';
            return {
                id: event.id,
                title: "#" + event.id || "Nome não informado",
                description: `${additivesDetails ? `Aditivos: <br />${additivesDetails}` : ''}`, 
                date: event.created_at,
                deleted_at: event.deleted_at ? 'deleted-' + event.deleted_at : 'deleted-null'
            };
        });
    }, []);
    


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
