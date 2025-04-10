import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { contractFields } from "../../../constants/forms/contractFields";
import { setDefaultFieldValues, transformObjectValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import { transformValues } from '../../../utils/objectUtils';
import SectionHeader from '../../../components/forms/SectionHeader';
import SimpleBody from '../../../components/forms/SimpleBody';
import TableBody from '../../../components/forms/TableBody';
import { v4 as uuidv4 } from 'uuid';

const CreateContractPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchOrganizations,
        get: fetchContractTypes,
        get: fetchCustomers,
        get: fetchStatus,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, setFormData, handleChange, resetForm } = useForm(setDefaultFieldValues(contractFields));

    const [allFieldsData, setAllFieldsData] = useState([])
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items:[],
            jobs:[]
        }));
    }, []);

    useEffect(() => {
        contractFields.forEach((section) => {
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
                        } else if (column === 'excel' && !prev[key]?.[column]) {
                            acc[key][column] = { value: true, label: 'Não' };
                        }
                        else {
                            if (currentValue.isMulti && !Array.isArray(prev[key])) {
                                acc[key][column] = prev[key]?.[column] ? [prev[key]?.[column]] : []; 
                            } else {
                                acc[key][column] = prev[key]?.[column] || '';
                            }
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
    }, [contractFields]);

    const getOptions = (fieldId) => {
        switch (fieldId) {
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

        if (key && formData) {
            setFormData((prev) => ({
                ...prev,
                items: [...(prev.items || []), fieldsData.items]
            }));
            
            setFieldsData(prev => ({
                ...prev,
                [key]: {}
            }));
        }
            
        showNotification('success', 'Dados adicionados na tabela');
            
        
    }

    const handleSubmit = async () => {
        showLoader();
        try {
            const transformedData = {
                ...formData,
                contract: transformObjectValues(formData.contract),
                items: transformValues(formData.items),
                jobs: transformValues(formData.jobs)
            }
            const success = await create(entities.contracts.create, transformedData);
            if (success) {
                resetForm();
                setFormData(prev => ({
                    ...prev,
                    items:[],
                    jobs:[]
                }));
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
            <PageHeader title="Cadastro de Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => 
                        contractFields.map((section) => (
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
                                        handleFileFieldChange={() => {}}
                                    />
                                ) : (
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

export default CreateContractPage;
