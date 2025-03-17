import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { contractDetailsFields } from '../../../constants/forms/contractFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import ListHeader from '../../../components/ListHeader';
import { PAGINATION } from '../../../constants/pagination';
import DynamicTable from '../../../components/DynamicTable';

const DetailsContractPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const [items, setItems] = useState([]);
    const [jobs, setJobs] = useState([]);
    const { formData, formatData, setFormData } = useForm(setDefaultFieldValues(contractDetailsFields))
    const { 
        getByColumn: fetchById,
        get: fetchContractInfos,
        get: fetchItemsByContractId,
        get: fetchJobsByContractId
    } = useBaseService(navigate);
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

    const itemsHeaders = useMemo(() => ['ID', 'Item Id','Descrição', 'Quantidade', 'Preço'], []);
    const itemsActions = []
    const jobsHeaders = useMemo(() => ['ID', 'Item ID', 'Descrição'], []);
    const JobsActions = [];

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [contractResponse, contractInfosResponse] = await Promise.all([
                    fetchById(entities.contracts.getByColumn(id)),
                    fetchContractInfos(entities.contracts.infos.getByColumn(id))
                ]);
                formatData({
                    contract: contractResponse.result,
                    info: contractInfosResponse.result
                }, contractDetailsFields);
            } catch (error) {
                console.error('Erro ao carregar detalhes do contrato:', error);
                showNotification('error', 'Erro ao carregar os dados.');
            } finally {
                hideLoader();
            }
        };
    
        fetchProductDetails();
    }, [id, navigate]);

    const fetchItems = async (filtersSubmit) => {
        try {
            showLoader();
            const contractItemsResponse = await fetchItemsByContractId(entities.contracts.items.get(id), filtersSubmit || filtersItems);
            
            setItems(Object.values(contractItemsResponse.result.data).map((item) => ({
                id: item.id,
                item: item.item_id,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                deleted_at: item.deleted_at ? 'deleted-' + item.deleted_at : 'deleted-null'
            })));
            
            setCurrentPageItems(contractItemsResponse.result.current_page);
            setTotalPagesItems(contractItemsResponse.result.last_page)
        } catch (error) {
            console.error('Erro ao carregar detalhes do contrato:', error);
            showNotification('error', 'Erro ao carregar os dados.');
        } finally {
            hideLoader();
        }
    }

    const fetchJobs = async (filtersSubmit) => {
            try {
                showLoader()
                const jobsResponse = await fetchJobsByContractId(entities.contracts.jobs.get(id), filtersSubmit || filtersItems)
                setJobs(jobsResponse.result.data.map((job) => ({
                    id: job.id,
                    item_id: job.item_id,
                    description: job.description,
                    deleted_at: job.deleted_at ? 'deleted-' + job.deleted_at : 'deleted-null'
                })));
                setCurrentPageJobs(jobsResponse.result.current_page)
                setTotalPagesJobs(jobsResponse.result.last_page)
            } catch (error) {
                console.log(error)
                showNotification('Erro ao carregar os dados.');
            } finally {
                hideLoader();
            }
        }

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={contractDetailsFields}/>

                <ListHeader
                    title='Itens do Contrato'
                    canAccess={() => {}}
                />

                <DynamicTable
                    headers={itemsHeaders}
                    data={items}
                    actions={itemsActions}
                    currentPage={currentPageItems}
                    totalPages={totalPagesItems}
                    onPageChange={fetchItems}
                    filters={filtersItems}
                    setFilters={setFiltersItems}
                />

                <ListHeader
                    title='Serviços do Contrato'
                    canAccess={() => {}}
                />

                <DynamicTable
                    headers={jobsHeaders}
                    data={jobs}
                    actions={JobsActions}
                    currentPage={currentPageJobs}
                    totalPages={totalPagesJobs}
                    onPageChange={fetchJobs}
                    filters={filtersJobs}
                    setFilters={setFiltersJobs}
                />
            </div>
        </MainLayout>
    );
};

export default DetailsContractPage;
