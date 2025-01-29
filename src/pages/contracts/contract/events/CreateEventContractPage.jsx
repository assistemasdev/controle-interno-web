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
import { useParams } from 'react-router-dom';

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
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(eventFields));
    const [types, setTypes] = useState([]);
    const { id } = useParams();
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            products:[],
            jobs:[]
        }));

        const fetchData = async () => {
            try {
                showLoader();
                const [
                    typesResponse,
                ] = await Promise.all([
                    fetchEventTypes(entities.contracts.eventsTypes.get()),
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
    

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "event.event_type_id":
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
            const success = await createContractEvent(entities.contracts.events.create(id), formData);
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
        const fielBelongsToAnArray = fieldId.split('.')[0]
        if (fielBelongsToAnArray == 'array') {
            const fieldSplit = fieldId.split('.')
            const idObject = fieldSplit[1]
            const key = fieldSplit[fieldSplit.length - 2];
            const column = fieldSplit[fieldSplit.length - 1];
            setFormData(prev => ({
                ...prev,
                [key]: prev[key].map(item => 
                    item.id === idObject ? { ...item, [column]: value } : item
                )
            }));
        }
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
                                setFormData={setFormData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateEventContractPage;
