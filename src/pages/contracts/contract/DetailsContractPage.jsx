import React, { useEffect } from 'react';
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

const DetailsContractPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, formatData, setFormData } = useForm(setDefaultFieldValues(contractDetailsFields))
    const { 
        getByColumn: fetchById,
        getByColumn: fetchOrganizationById,
        getByColumn: fetchCustomersById,
        getByColumn: fetchContractTypeById,
        getByColumn: fetchContractStatusById,
        get: fetchContractInfos
    } = useBaseService(navigate);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [contractResponse, contractInfosResponse] = await Promise.all([
                    fetchById(entities.contracts.getByColumn(id)),
                    fetchContractInfos(entities.contracts.infos.getByColumn(id))
                ]);
                
                const [organization, customer, contractType, contractStatus] = await Promise.all([
                    fetchOrganizationById(entities.organizations.getByColumn(contractResponse.result.organization_id)),
                    fetchCustomersById(entities.customers.getByColumn(contractResponse.result.customer_id)),
                    fetchContractTypeById(entities.contracts.types.getByColumn(null, contractResponse.result.contract_type_id)),
                    fetchContractStatusById(entities.contracts.status.getByColumn(null, contractResponse.result.contract_status_id))
                ]);

                formatData({
                    contract: contractResponse.result,
                    info: contractInfosResponse.result
                }, contractDetailsFields);

                setFormData(prev => ({
                    ...prev,
                    contract: {
                        ...prev.contract,
                        organization_id: organization.result.name,
                        customer_id: customer.result.name,
                        contract_type_id: contractType.result.name,
                        contract_status_id: contractStatus.result.name
                    }
                }))
            } catch (error) {
                console.error('Erro ao carregar detalhes do contrato:', error);
                showNotification('error', 'Erro ao carregar os dados.');
            } finally {
                hideLoader();
            }
        };
    
        fetchProductDetails();
    }, [id, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={contractDetailsFields}/>
            </div>
        </MainLayout>
    );
};

export default DetailsContractPage;
