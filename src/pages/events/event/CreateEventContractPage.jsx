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
import SectionHeader from '../../../components/forms/SectionHeader';
import SimpleBody from '../../../components/forms/SimpleBody';
import { faPen, faDollarSign } from '@fortawesome/free-solid-svg-icons';

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
    const [allFieldsData, setAllFieldsData] = useState([]);
    const [formFields, setFormFields] = useState(baseEventFields);
    const [viewTable, setViewTable] = useState(false);
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        formFields.forEach((section) => {
            const fields = section.fields;
            if (section.array) {
                setFormData(prev => {
                    const updatedData = fields.reduce((acc, currentValue) => {
                        const column = currentValue.id.split('.')[1];
                        const key = currentValue.id.split('.')[0];
                
                        if (!acc.exclude_ids) {
                            acc.exclude_ids = {};
                        }
                
                        if (column !== 'exclude_ids' && !acc.exclude_ids[column]) {
                            acc.exclude_ids[column] = [];
                        }
                
                        if (!acc[key]) {
                            acc[key] = {};
                        }
                
                        acc[key][column] = acc[key][column] || '';
                
                        return acc;
                    }, {});

                    return {
                        ...prev,
                        ...updatedData,
                    };
                });
                
            
                setHeaders(fields.reduce((acc, currentValue) => {
                    const cleanedValue = currentValue.label.replace(/:/g, '');
                    return [
                        ...acc,
                        cleanedValue
                    ];
                }, ['identify']));
            } else {
                setFormData(prev => {
                    return fields.reduce((acc, currentValue) => {
                        const key = currentValue.id.split('.')[0];
                        const column = currentValue.id.split('.')[1];
                
                        acc = { ...prev };
                
                        if (!acc.exclude_ids) {
                            acc.exclude_ids = {}; 
                        }
                
                        if (column !== 'exclude_ids' && !acc.exclude_ids[column]) {
                            acc.exclude_ids[column] = [];
                        }
                
                        if (!acc[key]) {
                            acc[key] = {};
                        }
                
                        if (!(column in acc[key])) {
                            acc[key][column] = ''; 
                        }
                
                        return acc;
                    }, { exclude_ids: {} });
                });           
            }
        })
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
            return;
        }
    
        const newFields = selectedEventTypes.reduce((acc, typeId) => {
            const fieldsForType = dynamicFields[typeId] || [];
            return [...acc, ...fieldsForType]; 
        }, []);
    
        if (formData.items?.new === true) {
            const sectionIndex = newFields.findIndex(section => section.section === 'Aditivo de Acréscimo');
        
            if (sectionIndex !== -1) {
                const section = newFields[sectionIndex];
                const fieldIds = section.fields.map(field => field.id);
        
                if (!fieldIds.includes('items.price')) {
                    section.fields.push(
                        { 
                            id: "items.price", 
                            label: "Preço", 
                            type: "number", 
                            placeholder: "Digite o preço do item",
                            icon: faDollarSign
                        }
                    );
                }
        
                if (!fieldIds.includes('items.description')) {
                    section.fields.push(
                        { 
                            id: "items.description", 
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
                section.fields = section.fields.filter(field => field.id !== 'items.price' && field.id !== 'items.description');
            }
        }
        
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
    }, [formData.event?.contract_event_type_id, formData.items?.new]);

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "event.contract_event_type_id":
                return types || [];
            case "items.new":
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
            const success = await createContractEvent(entities.contracts.events.create(id), formData);
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

    useEffect(() => {
        console.log(formData)
    }, [formData])

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
                                
                                />
                                {section.array ? (
                                    <></>
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
