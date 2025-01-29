import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { contractEditFields } from "../../../constants/forms/contractFields";
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const EditContractPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchById,
        get: fetchOrganizations, 
        get: fetchContractTypes,
        get: fetchCustomers,
        get: fetchContractStatus,
        put: update, 
        formErrors 
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const {
        formData,
        handleChange,
        initializeData,
        formatData
    } = useForm(setDefaultFieldValues(contractEditFields));
    const [organizations, setOrganizations] = useState([]);
    const [types, setTypes] = useState([]);
    const [status, setStatus] = useState([]);
    const [customers, setCustomers] = useState([]);
    
    useEffect(() => {
        initializeData(contractEditFields);

        const fetchData = async () => {
            showLoader();
            try {
                const [
                    contractResponse,
                    orgResponse,
                    typesResponse,
                    customersResponse,
                    statusResponse
                ] = await Promise.all([
                    fetchById(entities.contracts.getByColumn(id)),
                    fetchOrganizations(entities.organizations.get),
                    fetchContractTypes(entities.contracts.types.get()),
                    fetchCustomers(entities.customers.get),
                    fetchContractStatus(entities.contracts.status.get())
                ]);
                setOrganizations(orgResponse.result.data.map((org) => ({ value: org.id, label: org.name })));
                setTypes(typesResponse.result.data.map((type) => ({value: type.id, label: type.name}) ));
                setCustomers(customersResponse.result.data.map((customer) => ({value: customer.id, label: customer.name})));
                setStatus(statusResponse.result.data.map((status) => ({value: status.id, label: status.name})))
                formatData(contractResponse.result, contractEditFields)
            } catch (error) {
                console.error(error);
                showNotification('error', 'Erro ao carregar dados do contrato.');
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            showLoader();
            await update(entities.contracts.update(id), formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case 'organization_id':
                return organizations;
            case 'contract_type_id':
                return types;
            case 'customer_id':
                return customers;
            case 'contract_status_id':
                return customers;
            default:
                return [];
        }
    };

    const getSelectedValue = (fieldId) => {
        if (fieldId) {
            const value = formData[fieldId];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
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
                    Editar Contrato
                </p>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Salvar"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
                >
                    {() =>
                        contractEditFields.map(section => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                formErrors={formErrors}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditContractPage;
