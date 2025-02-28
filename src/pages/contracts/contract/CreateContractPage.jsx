import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { contractFields } from "../../../constants/forms/contractFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import { transformValues } from '../../../utils/objectUtils';
import FormSection from '../../../components/FormSection';

const CreateContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchOrganizations,
        get: fetchContractTypes,
        get: fetchCustomers,
        get: fetchStatus,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, setFormData, handleChange, resetForm } = useForm(setDefaultFieldValues(contractFields));
    const [organizations, setOrganizations] = useState([]);
    const [contractsTypes, setContractsTypes] = useState([]);
    const [status, setStatus] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState([])
    const [reloadForm, setReloadForm] = useState(false);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items:[],
            jobs:[]
        }));

        const fetchData = async () => {
            try {
                showLoader();
                const [
                    organizationsResponse,
                    typesResponse,
                    customersResponse,
                    statusResponse
                ] = await Promise.all([
                    fetchOrganizations(entities.organizations.get, {deleted_at: false}),
                    fetchContractTypes(entities.contracts.types.get(), {deleted_at: false}),
                    fetchCustomers(entities.customers.get, {deleted_at: false}),
                    fetchStatus(entities.contracts.status.get(), {deleted_at: false})
                ]);

                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setContractsTypes(typesResponse.result.data.map(type => ({ value: type.id, label: type.name })));
                setStatus(statusResponse.result.data.map(status => ({ value: status.id, label: status.name })));
                setCustomers(customersResponse.result.data.map(customer => ({ value: customer.id, label: customer.name })));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                showNotification('error', errorMessage);
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                hideLoader();
            }
        };
        fetchData();
    }, []);

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "contract.organization_id":
                return organizations || [];
            case "contract.contract_type_id":
                return contractsTypes || [];
            case "contract.customer_id":
                return customers || [];
            case "contract.contract_status_id":
                return status || [];
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = formData[category]?.[key];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            const transformedData = {
                ...formData,
                items: transformValues(formData.items),
                jobs: transformValues(formData.jobs)
            }
            const success = await create(entities.contracts.create, transformedData);
            if (success) {
                resetForm();
                setFormData(prev => ({
                    ...prev,
                    items:[],
                    jobs:[]
                }));
                setReloadForm(true);
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/contratos/`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);
    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        contractFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                                allFieldsData={allFieldsData}
                                setAllFieldsData={setAllFieldsData}
                                setFormErrors={setFormErrors}
                                setFormData={setFormData}
                                setReloadForm={setReloadForm}
                                reloadForm={reloadForm}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateContractPage;
