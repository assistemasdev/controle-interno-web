import React, { useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import Button from '../../../components/Button';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { contractFields } from '../../../constants/forms/contractFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import useContractService from '../../../hooks/services/useContractService';

const DetailsContractPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, formatData, setFormData } = useForm(setDefaultFieldValues(contractFields))
    const { fetchById } = useBaseService(entities.contracts, navigate);
    const { fetchById: fetchOrganizationById } = useBaseService(entities.organizations, navigate);
    const { fetchById: fetchCustomersById } = useBaseService(entities.customers, navigate);
    const { fetchById: fetchContractTypeById } = useBaseService(entities.contractTypes, navigate);
    const { fetchById: fetchContractStatusById } = useBaseService(entities.contractStatus, navigate);
    const { fetchInfos } = useContractService(navigate)

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [contractResponse, contractInfosResponse] = await Promise.all([
                    fetchById(id),
                    fetchInfos(id)
                ]);

                const [organization, customer, contractType, contractStatus] = await Promise.all([
                    fetchOrganizationById(contractResponse.result.organization_id),
                    fetchCustomersById(contractResponse.result.customer_id),
                    fetchContractTypeById(contractResponse.result.contract_type_id),
                    fetchContractStatusById(contractResponse.result.contract_status_id)
                ]);

                formatData({
                    contract: contractResponse.result,
                    info: contractInfosResponse.result
                }, contractFields);

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

    const handleBack = () => {
        navigate(`/contratos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Contrato
                </div>

                <DetailsSectionRenderer formData={formData} sections={contractFields}/>

                <div className="form-row gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsContractPage;
