import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import FormSection from '../../../components/FormSection';
import { contractFields } from "../../../constants/forms/contractFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CreateContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchOrganizations,
        get: fetchContractTypes,
        get: fetchCustomers,
        get: fetchStatus,
        formErrors 
    } = useBaseService(entities.contracts, navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(contractFields));
    const [organizations, setOrganizations] = useState([]);
    const [contractsTypes, setContractsTypes] = useState([]);
    const [status, setStatus] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const [
                    organizationsResponse,
                    typesResponse,
                    customersResponse,
                    statusResponse
                ] = await Promise.all([
                    fetchOrganizations(entities.organizations.get),
                    fetchContractTypes(entities.contracts.types.get()),
                    fetchCustomers(entities.customers.get),
                    fetchStatus(entities.contracts.status.get())
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
            const success = await create(entities.contracts.create, formData);
            if (success) {
                resetForm();
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
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">
                    Cadastro de Contrato
                </p>

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
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateContractPage;
