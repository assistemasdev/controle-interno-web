import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { baseEventFields, dynamicFields } from "../../../constants/forms/eventFields";
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import { useParams } from 'react-router-dom';
import PageHeader from '../../../components/PageHeader';
import SectionHeader from '../../../components/forms/SectionHeader';
import SimpleBody from '../../../components/forms/SimpleBody';
import { faPen, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import TableBody from '../../../components/forms/TableBody';
import { v4 as uuidv4 } from 'uuid';
import { transformValues, removeEmptyValues } from '../../../utils/objectUtils';
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
    const { formData, handleChange, setFormData, resetForm } = useForm({
        event: {
            contract_event_type_id: ''
        },
        items_addition: [],
        items_addendum: [],
        items_supression: [],
        info: {
            end_date: ''
        }
    });
    const [types, setTypes] = useState([]);
    const { id } = useParams();
    const [allFieldsData, setAllFieldsData] = useState([]);
    const [formFields, setFormFields] = useState(baseEventFields);
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})

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
            : [];  

        if (selectedEventTypes.length === 0) {
            setFormFields(baseEventFields);
            setFormData({
                event: { contract_event_type_id: '' },
                items_addition: [],
                items_addendum: [],
                items_supression: [],
                info: { end_date: '' }
            });
            return;
        }

        const newFields = selectedEventTypes.reduce((acc, typeId) => {
            const fieldsForType = dynamicFields[typeId] || [];
            return [...acc, ...fieldsForType]; 
        }, []);

        if (fieldsData.items_addition?.new && fieldsData.items_addition?.new.value === true) {
            const sectionIndex = newFields.findIndex(section => section.section === 'Aditivo de Acréscimo');
        
            if (sectionIndex !== -1) {
                const section = newFields[sectionIndex];
                const fieldIds = section.fields.map(field => field.id);
        
                if (!fieldIds.includes('items_addition.price')) {
                    section.fields.push(
                        { 
                            id: "items_addition.price", 
                            label: "Preço", 
                            type: "number", 
                            placeholder: "Digite o preço do item",
                            icon: faDollarSign
                        }
                    );
                }
        
                if (!fieldIds.includes('items_addition.description')) {
                    section.fields.push(
                        { 
                            id: "items_addition.description", 
                            label: "Descrição", 
                            type: "textarea", 
                            icon: faPen,
                            placeholder: "Digite a descrição do item",
                            fullWidth: true
                        }
                    );
                }
            }
        } else {
            const sectionIndex = newFields.findIndex(section => section.section === 'Aditivo de Acréscimo');
        
            if (sectionIndex !== -1) {
                const section = newFields[sectionIndex];
                section.fields = section.fields.filter(field => field.id !== 'items_addition.price' && field.id !== 'items_addition.description');
            }
        }

        setFormFields((prevFields) => {
            return [
                ...baseEventFields,  
                ...prevFields.filter(field => !newFields.some(newField => newField.id === field.id)),  
                ...newFields  
            ];
        });

    }, [formData.event?.contract_event_type_id, fieldsData.items_addition?.new]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            exclude_ids: {
                ...prev.exclude_ids,
                event: prev.event ? {
                    ...prev.exclude_ids?.event, 
                    contract_event_type_id: prev.event.contract_event_type_id
                } : {}
            }
        }));
    }, [formData.event?.contract_event_type_id]);
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "event.contract_event_type_id":
                return types || [];
            case "items_addition.new":
                return [{value: true, label: 'Sim'}, {value: false, label: 'Não'}];
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
                items_addition: transformValues(Array.isArray(formData.items_addition)? formData.items_addition.map((item) => removeEmptyValues(item)) : []),
                items_addendum: transformValues(Array.isArray(formData.items_addendum)? formData.items_addendum.map((item) => removeEmptyValues(item)) : []),
                items_supression: transformValues(Array.isArray(formData.items_supression)? formData.items_supression.map((item) => removeEmptyValues(item)) : [])   
            }
            const success = await createContractEvent(entities.contracts.events.create(id), transformedData);
            if (success) {
                setFormData(setDefaultFieldValues(baseEventFields));
                setFormFields(baseEventFields);
                resetForm();
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            hideLoader();
        }
    };

    const addFieldsInData = (section) => {
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

            setFieldsData(prev => ({
                ...prev,
                [key]: {

                }
            }))
        }
    
        showNotification('success', 'Dados adicionados na tabela');
    };

    const handleBack = () => {
        navigate(`/contratos/`);  
    };

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

export default CreateEventContractPage;
