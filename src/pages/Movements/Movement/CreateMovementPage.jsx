import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import FormSection from '../../../components/FormSection';
import { movementFields } from "../../../constants/forms/movementFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../../utils/objectUtils';

const CreateMovementPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchItemsOrdersServices,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(movementFields));
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [reloadForm, setReloadForm] = useState(false);
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))
    }, []);


    const fetchItemsOs = async () => {
        try {
            showLoader();
            if(formData.movement.service_order_id) {
                const response = await fetchItemsOrdersServices(entities.orders.items.get(formData.movement.service_order_id), {deleted_at: false})
                setItemsOrdersServices(response.result.data.map(orderItemService => ({ value: orderItemService.id, label: orderItemService.id })))
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchItemsOs()
    }, [formData.movement.service_order_id]);

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "items.service_order_item_id":
                return itemsOrdersServices || [];
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
                items: transformValues(Array.isArray(formData.items)? formData.items.map((item) => removeEmptyValues(item)) : [])
            }
            const success = await create(entities.movements.create, transformedData);
            if (success) {
                resetForm();
                setFormData(prev => ({
                    ...prev,
                    items: []
                }))
                setReloadForm(true)
            }
        } catch (error) {
            console.error('Error creating movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Movimento" showBackButton={true} backUrl="/movimentos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        movementFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                                setFormData={setFormData}
                                allFieldsData={allFieldsData}
                                setAllFieldsData={setAllFieldsData}
                                setFormErrors={setFormErrors}
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

export default CreateMovementPage;
