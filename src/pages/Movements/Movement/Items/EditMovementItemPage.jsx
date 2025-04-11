import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import { movementItemEditFields } from "../../../../constants/forms/movementItemFields";
import { removeEmptyValues, setDefaultFieldValues, transformObjectValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import SectionHeader from '../../../../components/forms/SectionHeader';
import SimpleBody from '../../../../components/forms/SimpleBody';

const EditMovementItemPage = () => {
    const { id, movementProductId, orderServiceId} = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        put: update, 
        get: fetchItemsOrdersServices,
        getByColumn: fetchMovementItemById,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(movementItemEditFields));
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))

        const fetchData = async () => {
            try {
                showLoader();
                const [
                    response,
                    responseItemsOrdersServices,
                ] = await Promise.all([
                    fetchMovementItemById(entities.movements.items.getByColumn(id, movementProductId)),
                    fetchItemsOrdersServices(entities.orders.items.get(orderServiceId))
                ]);
                setFormData({
                    movement_type_id: {value:response.result.movement_type_id, label:response.result.movement_name},
                    service_order_item_id: {value: response.result.service_order_item_id, label: response.result.service_order_item_id                    },
                    product_id: {value: response.result.product_id, label: response.result.product_name},
                })
                setItemsOrdersServices(responseItemsOrdersServices.result.data.map(orderItemService => ({ value: orderItemService.id, label: orderItemService.id })))
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
            case "service_order_item_id":
                return itemsOrdersServices || [];
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        const key = fieldId;
        if (key) {
            const value = formData[key];
            return getOptions(fieldId).find((option) => option.value === value.value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            const formatedData = transformObjectValues(formData)
            await update(entities.movements.items.update(id, movementProductId), formatedData);
        } catch (error) {
            console.error('Error edit movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/detalhes/${id}`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Produto do Movimento" showBackButton={true} backUrl={`/movimentos/detalhes/${id}`} />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                >
                    {() => 
                        movementItemEditFields.map((section) => (
                            <>
                                <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={false}
                                    setViewTable={() => {}}
                                    addFieldsInData={() => {}}
                                />
                                
                                <SimpleBody
                                    fields={section.fields}
                                    formErrors={formErrors}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
                                    getOptions={getOptions}
                                    getSelectedValue={getSelectedValue}
                                />
                                
                            </>
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditMovementItemPage;
