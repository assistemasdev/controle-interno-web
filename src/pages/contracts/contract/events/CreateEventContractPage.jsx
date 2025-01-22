import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import FormSection from '../../../../components/FormSection';
import { eventFields } from "../../../../constants/forms/eventFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';

const CreateEventContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { create, formErrors } = useBaseService(entities.contracts, navigate);
    const { fetchAll: fetchOrganizations } = useBaseService(entities.organizations, navigate);
    const { fetchAll: fetchTypes } = useBaseService(entities.contractTypes, navigate);
    const { fetchAll: fetchCustomers } = useBaseService(entities.customers, navigate);
    const { fetchAll: fetchStatus } = useBaseService(entities.contractStatus, navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(eventFields));
    const [organizations, setOrganizations] = useState([]);
    const [types, setTypes] = useState([]);
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
                    fetchOrganizations(),
                    fetchTypes(),
                    fetchCustomers(),
                    fetchStatus()
                ]);

                setOrganizations(organizationsResponse.result.data.map(org => ({ value: org.id, label: org.name })));
                setTypes(typesResponse.result.data.map(type => ({ value: type.id, label: type.name })));
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
                return types || [];
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

    const handleSubmit = async (data) => {
        showLoader();
        try {
            const success = await create(data);
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
                    Adicionar Evento no Contrato
                </p>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Adicionar"
                    textLoadingSubmit="Adicionando..."
                    handleBack={handleBack}
                >
                    {() => 
                        eventFields.map((section) => (
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

export default CreateEventContractPage;
