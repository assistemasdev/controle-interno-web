import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { baseEventFields, dynamicFields } from "../../../constants/forms/eventFields";
import { setDefaultFieldValues, transformValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import { useParams } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';
import ContractEventFormSection from '../../../components/forms/ContractEventFormSection';

const CreateEventContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        get: fetchEventTypes,
        post: createContractEvent, 
        formErrors, 
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(baseEventFields));
    const [types, setTypes] = useState([]);
    const { id } = useParams();
    const [allFieldsData, setAllFieldsData] = useState([])
    const [formFields, setFormFields] = useState(baseEventFields);


    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const [
                    typesResponse,
                ] = await Promise.all([
                    fetchEventTypes(entities.contracts.eventsTypes.get(), {deleted_at: false}),
                ]);
                setTypes(typesResponse.result.data.map(type => ({ value: type.id, label: type.name })));
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

    
    useEffect(() => {
        const selectedEventTypes = Array.isArray(formData.event.contract_event_type_id) 
            ? formData.event.contract_event_type_id 
            : null;  
    
        if (!selectedEventTypes) return; 
        
        const newFields = selectedEventTypes.reduce((acc, typeId) => {
            const fieldsForType = dynamicFields[typeId] || [];
            return [...acc, ...fieldsForType]; 
        }, []);
    
        setFormFields((prevFields) => {
            return [
                ...baseEventFields,  
                ...prevFields.filter(field => !newFields.some(newField => newField.id === field.id)),  
                ...newFields  
            ];
        });
    
        setFormData(prev => {
            const newData = { ...prev };
    
            newFields.forEach((field) => {
                if (!(field.id in newData)) {
                    newData[field.id] = field.defaultValue || '';  
                }
            });
    
            return newData;
        });
    }, [formData.event.contract_event_type_id]);
    
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "event.contract_event_type_id":
                return types || [];
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
            console.log(formData)
            const success = await createContractEvent(entities.contracts.events.create(id), formData);
            if (success) {
                resetForm();
                setFormFields(baseEventFields);
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
        const [category, key] = fieldId.split('.');
        
        if (category === 'array') {
            const [idObject, fieldName] = fieldId.split('.').slice(1);
    
            setFormData((prev) => {
                const updatedFields = prev[key].map((item) =>
                    item.id === idObject ? { ...item, [fieldName]: value } : item
                );
    
                return {
                    ...prev,
                    [key]: updatedFields,
                };
            });
        } else {
            handleChange(fieldId, value);
        }
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Adicionar Evento no Contrato" showBackButton={true} backUrl="/contratos" />

            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Adicionar"
                    textLoadingSubmit="Adicionando..."
                    handleBack={handleBack}
                >
                    {() => 
                        formFields.map((section) => (
                            <ContractEventFormSection 
                                key={section.section}
                                section={section} 
                                formData={formData}
                                setFormData={setFormData}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                handleFieldChange={handleFieldChange}
                                dynamicFields={dynamicFields}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                setAllFieldsData={setAllFieldsData}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateEventContractPage;
