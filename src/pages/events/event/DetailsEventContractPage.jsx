import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import DynamicTable from '../../../components/DynamicTable';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { usePermissions } from '../../../hooks/usePermissions';
import { PAGINATION } from '../../../constants/pagination';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { contractDetailsFields } from '../../../constants/forms/contractFields';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';
import useBaseService from '../../../hooks/services/useBaseService';
import PageHeader from '../../../components/PageHeader';
import ListHeader from '../../../components/ListHeader';
import useAction from '../../../hooks/useAction';

const DetailsEventContractPage = () => {
    const navigate = useNavigate();
    const { id, eventId } = useParams();
    const { canAccess } = usePermissions();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { 
        getByColumn: fetchContractById,
        get: fetchAllEventItens, 
        get: fetchAllEventJobs,
    } = useBaseService(navigate);
    const {
        getByColumn: fetchEventInfoByEventId,
    } = useBaseService();
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(contractDetailsFields));
    const [items, setItems] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [currentPageItems, setCurrentPageItems] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesItems, setTotalPagesItems] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [filtersItems, setFiltersItems] = useState({
        deleted_at:false,
        page: 1,
        perPage:totalPagesItems
    });
    const [currentPageJobs, setCurrentPageJobs] = useState(PAGINATION.DEFAULT_PAGE);
    const [totalPagesJobs, setTotalPagesJobs] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [filtersJobs, setFiltersJobs] = useState({
        deleted_at:false,
        page: 1,
        perPage:totalPagesJobs
    });

    const { 
        openModalConfirmation: openModalConfirmationItem, 
        action: actionItem, 
        handleActivate: handleActivateItem, 
        handleDelete: handleDeleteItem, 
        handleConfirmAction: handleConfirmActionItem, 
        handleCancelConfirmation: handleCancelConfirmationItem, 
        selectedItem: selectedItem
    } = useAction(navigate); 

    const { 
        openModalConfirmation: openModalConfirmationJob, 
        action: actionJob, 
        handleActivate: handleActivateJob, 
        handleDelete: handleDeleteJob, 
        handleConfirmAction: handleConfirmActionJob, 
        handleCancelConfirmation: handleCancelConfirmationJob, 
        selectedItem: selectedJob
    } = useAction(navigate); 

    const fetchData = async () => {
        showLoader();
        try {
            const contractResponse = await fetchContractById(entities.contracts.getByColumn(id))
            const eventInfoResponse = await fetchEventInfoByEventId(entities.contracts.events.infos(id).get(eventId) + '/previous');
           
            formatData({
                contract: contractResponse.result,
                info: eventInfoResponse.result
            }, contractDetailsFields);

            fetchItems()
            fetchJobs()
        } catch (error) {
            console.log(error)
            showNotification('Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    };


    const fetchItems = async (filtersSubmit) => {
        try {
            showLoader()
            const eventItemsResponse = await fetchAllEventItens(entities.contracts.events.items(id).get(eventId) + '/previous', filtersSubmit || filtersItems)
            setItems(eventItemsResponse.result.data.map((eventItem) => ({
                id: eventItem.id,
                item: eventItem.item_id,
                description: eventItem.description,
                quantity: eventItem.quantity,
                price: eventItem.price,
                deleted_at: eventItem.deleted_at ? 'deleted-' + eventItem.deleted_at : 'deleted-null'
            })));
            setCurrentPageItems(eventItemsResponse.result.current_page);
            setTotalPagesItems(eventItemsResponse.result.last_page)
        } catch (error) {
            console.log(error)
            showNotification('Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    }

    const fetchJobs = async (filtersSubmit) => {
        try {
            showLoader()
            const eventJobsResponse = await fetchAllEventJobs(entities.contracts.events.jobs(id).get(eventId), filtersSubmit || filtersItems)
            setJobs(eventJobsResponse.result.data.map((job) => ({
                id: job.id,
                item_id: job.item_id,
                description: job.description,
                deleted_at: job.deleted_at ? 'deleted-' + job.deleted_at : 'deleted-null'
            })));
            setCurrentPageJobs(eventJobsResponse.result.current_page)
            setTotalPagesJobs(eventJobsResponse.result.last_page)
        } catch (error) {
            console.log(error)
            showNotification('Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    const itemsHeaders = useMemo(() => ['ID', 'Item Id','Descrição', 'Quantidade', 'Preço'], []);
    
    // const itemsActions = useCallback([
    //     {
    //         id:'edit',
    //         icon: faEdit,
    //         title: 'Editar',
    //         buttonClass: 'btn-primary',
    //         permission: 'Atualizar evento',
    //         onClick: (eventItem) => navigate(`/contratos/${id}/eventos/${eventId}/itens/editar/${eventItem.id}`)
    //     },
    //     {
    //         id: 'delete',
    //         icon: faTrash,
    //         title: 'Excluir',
    //         buttonClass: 'btn-danger',
    //         permission: 'Excluir evento ',
    //         onClick: (eventItem) => handleDeleteItem(eventItem, 'Você tem certeza que deseja excluir: ', entities.contracts.events.items(id).delete(eventId, eventItem.id), fetchItems),
    //     },
    //     {
    //         id: 'activate',
    //         icon: faUndo,
    //         title: 'Ativar',
    //         buttonClass: 'btn-info',
    //         permission: '',
    //         onClick: (eventItem) => handleActivateItem(eventItem, 'Você tem certeza que deseja ativar: '),
    //     },
    // ], [handleDeleteItem]);

    const jobsHeaders = useMemo(() => ['ID', 'Item ID', 'Descrição'], []);
    
    // const JobsActions = useCallback([
    //     {
    //         id:'edit',
    //         icon: faEdit,
    //         title: 'Editar',
    //         buttonClass: 'btn-primary',
    //         permission: 'Atualizar evento',
    //         onClick: (eventItem) => navigate(`/contratos/${id}/eventos/${eventId}/servicos/editar/${eventItem.id}`)
    //     },
    //     {
    //         id: 'delete',
    //         icon: faTrash,
    //         title: 'Excluir',
    //         buttonClass: 'btn-danger',
    //         permission: 'Excluir evento ',
    //         onClick: (eventItem) => handleDeleteItem(eventItem, 'Você tem certeza que deseja excluir: ', entities.contracts.events.items(id).delete(eventId, eventItem.id), fetchItems),
    //     },
    //     {
    //         id: 'activate',
    //         icon: faUndo,
    //         title: 'Ativar',
    //         buttonClass: 'btn-info',
    //         permission: '',
    //         onClick: (eventItem) => handleActivateItem(eventItem, 'Você tem certeza que deseja ativar: '),
    //     },
    // ], [handleDeleteItem]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Contrato" showBackButton={true} backUrl={`/contratos/${id}/eventos/historico`}/>
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={contractDetailsFields} formData={formData}/>
                
                <ListHeader
                    title='Itens do Contrato'
                    canAccess={() => {}}
                />

                <DynamicTable
                    headers={itemsHeaders}
                    data={items}
                    actions={[]}
                    currentPage={currentPageItems}
                    totalPages={totalPagesItems}
                    onPageChange={fetchItems}
                    filters={filtersItems}
                    setFilters={setFiltersItems}
                />

                <ConfirmationModal
                    open={openModalConfirmationItem}
                    onClose={handleCancelConfirmationItem}
                    onConfirm={handleConfirmActionItem}
                    itemName={selectedItem ? `${selectedItem.id} - ${selectedItem.description}` : ''}
                    text={actionItem.text}
                />

                <ListHeader
                    title='Serviços do Contrato'
                    canAccess={() => {}}
                />

                <DynamicTable
                    headers={jobsHeaders}
                    data={jobs}
                    actions={[]}
                    currentPage={currentPageJobs}
                    totalPages={totalPagesJobs}
                    onPageChange={fetchJobs}
                    filters={filtersJobs}
                    setFilters={setFiltersJobs}
                />

                {/* <ConfirmationModal
                    open={openModalConfirmationItem}
                    onClose={handleCancelConfirmationItem}
                    onConfirm={handleConfirmActionItem}
                    itemName={selectedItem ? `${selectedItem.id} - ${selectedItem.description}` : ''}
                    text={actionItem.text}
                />

                <ConfirmationModal
                    open={openModalConfirmationJob}
                    onClose={handleCancelConfirmationJob}
                    onConfirm={handleConfirmActionJob}
                    itemName={selectedJob ? `${selectedJob.id} - ${selectedJob.description}` : ''}
                    text={actionJob.text}
                /> */}
            </div>
        </MainLayout>
    );
};

export default DetailsEventContractPage;
