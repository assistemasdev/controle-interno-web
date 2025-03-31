import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { baseMovementFields, dynamicFields } from "../../../constants/forms/movementFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../../utils/objectUtils';
import SectionHeader from '../../../components/forms/SectionHeader';
import TableBody from '../../../components/forms/TableBody';
import SimpleBody from '../../../components/forms/SimpleBody';
import { v4 as uuidv4 } from 'uuid';

const CreateMovementPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchItemsOrdersServices,
        getByColumn: fetchOrderServiceItemById,
        getByColumn: fetchContractById,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm({});
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [reloadForm, setReloadForm] = useState(false);
    const [formFields, setFormFields] = useState(baseMovementFields);
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: [],
            filters: {
                movement: {
                    service_order_id: {
                        status_id: [1,2]
                    }
                }
            }
        }))
    }, []);

     useEffect(() => {
        formFields.forEach((section) => {
            const fields = section.fields;
            if (section.array) {
                setFieldsData(prev => {
                    const updatedData = fields.reduce((acc, currentValue) => {
                        const column = currentValue.id.split('.')[1];
                        const key = currentValue.id.split('.')[0];
    
                        if (!acc.exclude_ids) {
                            acc.exclude_ids = {};
                        }
    
                        if (!acc[key]) {
                            acc[key] = {};
                        }

                        if (column === 'identify' && !prev[key]?.[column]) {
                            const uuid = uuidv4().slice(0, 8); 
                            acc[key][column] = { value: uuid, label: uuid };
                        } else {
                            acc[key][column] = prev[key]?.[column] || ''; 
                        }
                        return acc;
                    }, {});
                    Object.entries(updatedData).map(([key, headers]) => ({
                        section: key,
                        headers: headers,
                    }))

                    return {
                        ...prev,
                        ...updatedData,
                    };
                });
    
                setHeaders(prev => {
                    return fields.reduce((acc, currentValue) => {
                        const key = currentValue.id.split('.')[0];  
                        const cleanedValue = currentValue.label.replace(/:/g, '');
                                        
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                
                        acc[key] = Array.from(new Set([...acc[key], cleanedValue]));  
                
                
                        return acc;
                    }, { ...prev });  
                });
                
            } else {
                setFormData(prev => {
                    const updatedData = fields.reduce((acc, currentValue) => {
                        const key = currentValue.id.split('.')[0];
                        const column = currentValue.id.split('.')[1];
    
                        acc = { ...prev };
    
                        if (!acc.exclude_ids) {
                            acc.exclude_ids = {};
                        }
    
                        if (column !== 'exclude_ids') {
                            if (!acc.exclude_ids[key]) {
                                acc.exclude_ids[key] = {}; 
                            }
    
                            if (!acc.exclude_ids[key][column]) {
                                acc.exclude_ids[key][column] = [];
                            }
                        }
    
                        if (!acc[key]) {
                            acc[key] = {};
                        }
    
                        if (!(column in acc[key])) {
                            acc[key][column] = prev[key]?.[column] || ''; 
                        }
                        return acc;
                    }, prev); 
    
                    return updatedData;
                });
            }
        });
    }, [formFields]);

    useEffect(() => {
        const fetchDataAndUpdateFields = async () => {
            if (!fieldsData.items?.service_order_item_id?.value) {
                setFieldsData(prev => ({
                    exclude_ids: {
                        ...prev.exclude_ids
                    },
                    items: {
                        ...prev.items,
                        service_order_item_id: ""
                    }
                }));
                return;
            }
    
            try {
                const response = await getMovementTypeIdAndProductId(fieldsData.items?.service_order_item_id?.value);
                setFieldsData(prev => ({
                    ...prev,
                    items: {
                        ...prev.items,
                        movement_type_id: response.movementTypeId,
                        product_id: prev.items?.product_id 
                        ? { ...prev.items.product_id } 
                        : response.movementTypeId === 3 
                            ? response.productId 
                            : ''
                                        
                    }
                }));
    
                const updatedBaseMovementFields = [...baseMovementFields];
                const sectionIndex = updatedBaseMovementFields.findIndex(item => item.section === 'Produtos');
    
                if (sectionIndex !== -1) {
                    const sectionFields = updatedBaseMovementFields[sectionIndex].fields;
    
                    const baseFields = sectionFields.filter(
                        field => field.id === "items.service_order_item_id" || field.id === "items.identify"
                    );
                    const newDynamicFields = dynamicFields[response.movementTypeId] || [];

                    updatedBaseMovementFields[sectionIndex].fields = [
                        ...baseFields, 
                        ...newDynamicFields  
                    ];
                }
    
                setFormFields(updatedBaseMovementFields);
                setFieldsData(prev => ({
                    ...prev,
                    filters: {
                        ...prev.filters,
                        items: { 
                                product_id: {
                                    status_id: response.movementTypeId == 3 ? 2 : 1
                                }
                            }
                            
                    }
                }));
    
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchDataAndUpdateFields();
    }, [fieldsData.items?.service_order_item_id?.value]);

    const getMovementTypeIdAndProductId = async (id) => {
        try {
            showLoader()
            const response = await fetchOrderServiceItemById(entities.orders.items.getByColumn(formData.movement.service_order_id, id))
            return {
                movementTypeId: response.result.movement_type_id, 
                productId: response.result.product_id
            };
        } catch(error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }

    const addFieldsInData = async (section) => {
        const key = section.fields[0].id.split('.')[0];
        const newFormErrors = {};
        let hasError = false;

        section.fields.forEach((field) => {
            if (fieldsData[field.id.split('.')[1]]) {
                delete formErrors[fieldsData[field.id.split('.')[1]]];
            }
        });

        section.fields.forEach((field) => {
            const [column, key] = field.id.split('.');
            
            if (!field.notRequired && (!fieldsData[column] || !fieldsData[column][key] || fieldsData[column][key]?.toString().trim() === "")) {
                hasError = true;
        
                if (!newFormErrors[column]) {
                    newFormErrors[column] = {};  
                }
        
                if (!newFormErrors[column][key]) {
                    newFormErrors[column][key] = `O campo ${field.label} é obrigatório.`;  
                }
            }
        });

        if (hasError) {
            setFormErrors((prev) => ({
                ...prev,
                ...newFormErrors, 
            }));
            return;
        }

        setFormErrors((prev) => {
            const updatedErrors = Object.keys(prev).reduce((acc, errorKey) => {
                if (!errorKey.startsWith(`${key}.0.`)) {
                    acc[errorKey] = prev[errorKey]; 
                }
                return acc;
            }, {});
            return updatedErrors;
        });

        const existsInItems = formData.items?.some(item => 
            item.product.value === fieldsData.items.product.value
        );
        
        if (existsInItems) {
            showNotification('warning', 'Item já foi adicionado na tabela de itens')
        } else {
            if (formData[key] && formData[key].some(item => item.identify == fieldsData[key].identify)) {
                setFormData((prev) => {
                    const prevArray = prev[key] || []; 
                    const updatedData = {
                        ...prev,
                        [key]: prevArray.map(item => {                
                            if (item.identify === fieldsData[key].identify) {
                                return { ...item, ...fieldsData[key] };
                            } else {
                                return item;
                            }
                        })
                    };
                    
                    return updatedData
                });
    
                setFieldsData(prev => {
                    const newFieldsData = {
                        ...prev,
                        [key]: {}
                    };
                    return newFieldsData;
                });
    
                return;
            }
    
            if (key && formData) {
                setFormData((prev) => ({
                    ...prev,
                    [key]: Array.isArray(prev[key]) ? [
                        ...prev[key],
                        fieldsData[key] 
                    ] : [fieldsData[key]] 
                }));
                setFieldsData(prev => {
                    return {
                        ...prev,
                        [key]: {}
                    };
                });
            }
    
            setFormFields(baseMovementFields);
            showNotification('success', 'Dados adicionados na tabela');
            
        }
    };

    const fetchItemsOs = async () => {
        try {
            showLoader();
            if(formData.movement?.service_order_id) {
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

    const fetchCustomerAndOrganization = async () => {
        try {
            showLoader();
            if(formData.movement?.service_order_id) {
                const response = await fetchOrderServiceItemById(entities.orders.getByColumn(formData.movement.service_order_id), {deleted_at: false})
                const responseContract = await fetchContractById(entities.contracts.getByColumn(response.result.contract_id));
                setFormData(prev => ({
                    ...prev,
                    movement: {
                        ...prev.movement,
                        customer_id: responseContract.result.customer_id,
                        organization_id: responseContract.result.organization_id
                    }
                }))
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    }

    useEffect(() => {
        fetchItemsOs()
        fetchCustomerAndOrganization()
    }, [formData.movement?.service_order_id]);

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
                        formFields.map((section) => (
                            <>
                                <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={viewTable}
                                    setViewTable={setViewTable}
                                    addFieldsInData={addFieldsInData}
                            
                                />
                                {section.array ? (
                                    <TableBody
                                        section={section}
                                        headers={headers}
                                        setFormData={setFormData}
                                        viewTable={viewTable}
                                        setViewTable={setViewTable}
                                        formData={formData}
                                        getOptions={getOptions}
                                        allFieldsData={allFieldsData}
                                        setAllFieldsData={setAllFieldsData}
                                        formErrors={formErrors}
                                        setFieldsData={setFieldsData}
                                        fieldsData={fieldsData}
                                    />
                                ): (
                                    <SimpleBody
                                        fields={section.fields}
                                        formErrors={formErrors}
                                        formData={formData}
                                        handleFieldChange={handleChange}
                                        getOptions={getOptions}
                                        getSelectedValue={getSelectedValue}
                                    />
                                )}
                            </>
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateMovementPage;
