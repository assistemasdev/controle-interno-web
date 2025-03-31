import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import { shipmentFields } from "../../../../constants/forms/shipmentFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../../../utils/objectUtils';
import SectionHeader from '../../../../components/forms/SectionHeader';
import TableBody from '../../../../components/forms/TableBody';
import SimpleBody from '../../../../components/forms/SimpleBody';
import { v4 as uuidv4 } from 'uuid';

const CreateMovementsShipmentsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        getByColumn: fetchMovementItemById,
        getByColumn: fetchMovementById,
        getByColumn: fetchProductById,
        get: fetchAddresses,
        get: fetchLocations,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(shipmentFields));
    const [allFieldsData, setAllFieldsData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [responsibleId, setResponsibleId] = useState({});
    const [locations, setLocations] = useState([]);
    const [reloadForm, setReloadForm] = useState(false);
    const [viewTable, setViewTable] = useState(false);
    const [headers, setHeaders] = useState([]);
    const [fieldsData, setFieldsData] = useState({});
    const [formFields, setFormFields] = useState(shipmentFields)

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))
    }, []);

    useEffect(() => {
        setReloadForm(false);
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
    }, [formFields, reloadForm]);

    useEffect(() => {
        setFieldsData(prev => ({
            ...prev,
            filters: {
                items: {
                    movement_item_id: {
                        movement_id: id
                    }
                }
            }
        }))
    }, [])

    const fetchData = async () => {
        if (fieldsData?.items?.movement_item_id?.value) {
            try {
                showLoader();
    
                const [
                    responseMovement,
                    responseMovementItem
                ] = await Promise.all([
                    fetchMovementById(entities.movements.getByColumn(id)),
                    fetchMovementItemById(entities.movements.items.getByColumn(id, fieldsData?.items?.movement_item_id.value)),
                ]);
                
                const movementItem = responseMovementItem.result;
                const responseProduct = await fetchProductById(entities.products.getByColumn(movementItem.product_id));
                const product = responseProduct.result;
                let addressesReponse;

                if (movementItem.movement_type_id == 3 || (movementItem.movement_type_id == 2 && movementItem.operation_type == 'devolucao')) {
                    addressesReponse = await fetchAddresses(entities.organizations.addresses.get(product.current_organization_id));
                    setResponsibleId({
                        organizationId:product.current_organization_id
                    })
                } else {
                    addressesReponse = await fetchAddresses(entities.customers.addresses.get(responseMovement.result.customer_id));
                    setResponsibleId({
                        customerId:responseMovement.result.customer_id
                    })
                }

                setFormData((prev) => ({
                    ...prev,
                    shipment: {
                        ...prev.shipment,
                        movement_id: id
                    }
                }));
    
                setAddresses(addressesReponse.result.data.map((address) => ({
                    value: address.id,
                    label: `${address.street}, ${address.city} - ${address.state}`,
                })));
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                showNotification('error', errorMessage);
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                hideLoader();
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, [fieldsData?.items?.movement_item_id])

    useEffect(() => {
        fetchLocationsData()
    }, [fieldsData?.items?.address_id])
    
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            shipment: {
                ...prev.shipment,
                movement_id: id
            }
        }))
    }, [])
    
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
            item.product?.value === fieldsData.items?.product?.value
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
    
            setFormFields(shipmentFields);
            setReloadForm(true);
            showNotification('success', 'Dados adicionados na tabela');
            
        }
    };
    const fetchLocationsData = async () => {
        try {
            showLoader()
            if (fieldsData?.items?.address_id) {
                const url = responsibleId.customerId ? entities.customers.addresses.locations(responsibleId.customerId).get(fieldsData?.items?.address_id?.value) :
                entities.organizations.addresses.locations(responsibleId.organizationId).get(fieldsData?.items?.address_id?.value)

                const response = await fetchLocations(url, {deleted_at: false});
                const locationsFormatted = response.result.data.map(location => {
                    const parts = [location.area];
                
                    if (location.section) {
                        parts.push(location.section);
                    }
                
                    if (location.spot) {
                        parts.push(`- ${location.spot}`);
                    }
                
                    return {
                        value: location.id,
                        label: parts.join(', ')
                    };
                });
                setLocations(locationsFormatted);
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "items.address_id":
                return addresses || [];
            case "items.location_id":
                return locations || [];

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
            const success = await create(entities.movements.shipments.create(id), transformedData);
            if (success) {
                resetForm();
                setFormData((prev) => ({
                    ...prev,
                    shipment: {
                        ...prev.shipment,
                        movement_id: id
                    }
                }))
            }
        } catch (error) {
            console.error('Error creating movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/${id}/carregamentos`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Carregamento do Movimento" showBackButton={true} backUrl={`/movimentos/${id}/carregamentos`}/>
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

export default CreateMovementsShipmentsPage;
