import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import Form from '../../../../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { dynamicFields, baseOsFields } from '../../../../constants/forms/orderServiceFields';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import { transformValues } from '../../../../utils/objectUtils';
import PageHeader from '../../../../components/PageHeader';
import SectionHeader from '../../../../components/forms/SectionHeader';
import TableBody from '../../../../components/forms/TableBody';
import SimpleBody from '../../../../components/forms/SimpleBody';
import { v4 as uuidv4 } from 'uuid';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';

const CreateContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchProducts,
        getByColumn: fetchContractById,
        get: fetchAddressCustomer,
        get: fetchLocationsCustomer,
        post: create, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, setFormData } = useForm({});
    const [formFields, setFormFields] = useState(baseOsFields);
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [contract, setContract] = useState({});
    const [locations, setLocations] = useState([]);
    const [reloadForm, setReloadForm] = useState(false);
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

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
        if (!fieldsData.items?.movement_type_id?.value) {
            setFieldsData(prev => ({
                exclude_ids: {
                    ...prev.exclude_ids
                },
                items: {
                    ...prev.items,
                    movement_type_id: ""
                }
            }));
            return;
        }
    
        const updatedBaseOsFields = [...baseOsFields];
        const sectionIndex = updatedBaseOsFields.findIndex(item => item.section === 'Produtos');
    
        if (sectionIndex !== -1) {
            const sectionFields = updatedBaseOsFields[sectionIndex].fields;
    
            const baseFields = sectionFields.filter(
                field => field.id === "items.movement_type_id" || field.id === "items.identify"
            );
    
            const newDynamicFields = dynamicFields[fieldsData.items?.movement_type_id?.value] || [];
    
            updatedBaseOsFields[sectionIndex].fields = [
                ...baseFields, 
                ...newDynamicFields  
            ];
        }
    
        setFormFields(updatedBaseOsFields);
    }, [fieldsData.items?.movement_type_id?.value]);    
    
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
            setFieldsData(prev => {
                return {
                    ...prev,
                    [key]: {}
                };
            });
        }

        setFormFields(baseOsFields);
        showNotification('success', 'Dados adicionados na tabela');
    };

    const fetchData = async () => {
        try {
            showLoader()
            const [
                productsResponse,
                contractResponse
            ] = await Promise.all([
                fetchProducts(entities.products.get, {deleted_at: false}),
                fetchContractById(entities.contracts.getByColumn(id), {deleted_at: false})
            ])
    
            const [addressesResponse] = await Promise.all([
                fetchAddressCustomer(entities.customers.addresses.get(contractResponse.result.customer_id), {deleted_at: false})
            ])

            setContract(contractResponse.result);

            setAddresses(addressesResponse.result.data.map((address) => ({
                value: address.id,
                label: `${address.street}, ${address.city} - ${address.state}`,
            })));

            setProducts(productsResponse.result.data.map((product) => ({
                label: product.name,
                value: product.id
            })))
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "items.product_id":
                return products || [];
            case "items.address_id":
                return addresses || [];
            case "items.location_id":
                return locations || [];
            case "items.product_id":
                return products || [];
            default:
                return [];
        }
    };

    useEffect(() => {
        fetchLocations()
    }, [allFieldsData?.items?.address_id])
    
    const fetchLocations = async () => {
        try {
            showLoader()
            if (allFieldsData?.items?.address_id) {
                const response = await fetchLocationsCustomer(entities.customers.addresses.locations(contract.customer_id).get(allFieldsData?.items?.address_id?.value), {deleted_at: false});
                setLocations(response.result.data.map((location) => ({
                    label: `${location.area}, ${location.section} - ${location.spot}`,
                    value: location.id
                })))
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader()
        }
    }
    const getSelectedValue = (fieldId) => {
        const [category, key] = fieldId.split(".");
        if (key) {
            const value = formData[category]?.[key];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        try {
            const transformedData = {
                ...formData,
                items: transformValues(formData.items)
            }
            const success = await create(entities.contracts.orders.create(id) ,transformedData);
            if (success) {
                setFormData(setDefaultFieldValues(baseOsFields));
                setFormFields(baseOsFields);
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar status:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/`} />
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

export default CreateContractOsPage;
