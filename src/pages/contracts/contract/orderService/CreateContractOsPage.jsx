import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import Form from '../../../../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { FaUser, FaBuilding, FaRegAddressCard, FaHashtag } from 'react-icons/fa'; 
import { dynamicFields, baseOsFields } from '../../../../constants/forms/orderServiceFields';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import { transformObjectValues, transformValues } from '../../../../utils/objectUtils';
import PageHeader from '../../../../components/PageHeader';
import SectionHeader from '../../../../components/forms/SectionHeader';
import TableBody from '../../../../components/forms/TableBody';
import SimpleBody from '../../../../components/forms/SimpleBody';
import { v4 as uuidv4 } from 'uuid';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import DynamicHeaderForm from '../../../../components/forms/DynamicHeaderForm';
import DynamicBoxForm from '../../../../components/forms/DynamicBoxForm';
import InfoBox from '../../../../components/box/InfoBox';
import ContainerBox from '../../../../components/box/ContainerBox';
import ItemContainerBox from '../../../../components/box/ItemContainerBox';
import ProgressBar from '../../../../components/box/ProgressBar';
import { extractFirstColumnFromExcel } from '../../../../utils/extractFirstColumnFromExcel';

const CreateContractOsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        get: fetchProducts,
        get: fetchContractItems,
        getByColumn: fetchContractById,
        post: fetchProductsByIds,
        get: fetchAddressCustomer,
        get: fetchLocationsCustomer,
        get: fetchItemsKitByEquipamentKitId,
        post: create, 
        post: verifyExceededItemQuantities, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, setFormData } = useForm({});
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [contract, setContract] = useState({});
    const [contractItems, setContractItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [allFieldsData, setAllFieldsData] = useState({});
    const [formFields, setFormFields] = useState(baseOsFields);
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})
    const [viewMode, setViewMode] = useState("form");
    const [accessories, setAccessories] = useState([]);
    const options = [
        { value: "form", label: "Formulário" },
        { value: "contract", label: "Contrato" },
    ];
    const [originalTypes, setOriginalTypes] = useState({});

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
    
        const updatedBaseOsFields = baseOsFields.map(section => ({
            ...section,
            fields: [...section.fields] 
        }));

        const sectionIndex = updatedBaseOsFields.findIndex(item => item.section === 'Produtos');
    
        if (sectionIndex !== -1) {
            const sectionFields = updatedBaseOsFields[sectionIndex].fields;
    
            const baseFields = sectionFields.filter(
                field => field.id === "items.movement_type_id" || field.id === "items.identify"
            );
    
            const newDynamicFields = dynamicFields[fieldsData.items?.movement_type_id?.value] || [];
    
            updatedBaseOsFields[sectionIndex] = {
                ...updatedBaseOsFields[sectionIndex], 
                fields: [...baseFields, ...newDynamicFields] 
            };
        }

        setFormFields(updatedBaseOsFields);
        setFieldsData(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                items: (fieldsData.items?.movement_type_id?.value === 2 || fieldsData.items?.movement_type_id?.value === 3)
                    ? { 
                        product_id: {
                            status_id: 2 
                        }
                    }
                    : {}
            }
        }));
    }, [fieldsData.items?.movement_type_id?.value]);    

    useEffect(() => {
        setFormFields(prevSections =>
            prevSections.map(section => ({
                ...section,
                fields: section.fields.map(field => {
                    if (field.id === "items.product_id") {
                        if (!fieldsData.items?.excel?.value) {
                            if (!originalTypes[field.id]) {
                                setOriginalTypes(prev => ({
                                    ...prev,
                                    [field.id]: field.type
                                }));
                            }
                            return { ...field, type: "file" };
                        } else {
                            return { ...field, type: originalTypes[field.id] || field.type };
                        }
                    }
                    return field;
                })
            }))
        );
    }, [fieldsData.items?.excel?.value]);

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                showLoader();
    
                const equipamentKitId = fieldsData.items?.equipament_kit?.value;
                if (!equipamentKitId) return;
    
                const response = await fetchItemsKitByEquipamentKitId(
                    entities.equipamentsKits.items.get(equipamentKitId),
                    { perPage: 0 }
                );

                const accessoriesList = response.result.data.map(accessory => ({
                    value: accessory.id,
                    label: accessory.name
                }));
    
                setAccessories(accessoriesList);
    
                setFieldsData(prev => ({
                    ...prev,
                    items: { 
                        ...prev.items,
                        accessories: accessoriesList 
                    }
                }));
            } catch (error) {
                console.log(error);
            } finally {
                hideLoader();
            }
        };
    
        if (fieldsData.items?.equipament_kit?.value) {
            fetchAccessories();
        }
    }, [fieldsData.items?.equipament_kit?.value]);
    
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
            item?.contract_item_id?.value &&  
            item.contract_item_id.value === fieldsData.items?.contract_item_id?.value
        );
        
        if (existsInItems) {
            showNotification('warning', 'Item já foi adicionado na tabela de itens')
        } else {
            if(fieldsData.items?.movement_type_id.value == 1) {
                try {
                    showLoader()
    
                    await verifyExceededItemQuantities(entities.contracts.orders.create(id) + '/verify-exceeded-item-quantities', {
                        contract_item_id: fieldsData.items?.contract_item_id.value,
                        quantity: fieldsData.items?.quantity.value
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
                } catch (error) {
                    console.log(error)
                } finally {
                    hideLoader()
                }
            } else {
                if (key && formData) {
                    setFormData((prev) => {
                        return {
                            ...prev,
                            items: fieldsData.items.product_id && Array.isArray(fieldsData.items.product_id)
                                ? fieldsData.items.product_id.map((product) => {
                                    const uuid = uuidv4().slice(0, 8); 
                                    return {
                                        ...fieldsData.items, 
                                        identify: { value: uuid, label: uuid },
                                        product_id: { value: product.value, label: product.label } ,
                                        excel: { value: true, label: 'Não'}
                                    };
                                })
                                : [{ ...fieldsData.items }]
                        };
                    });
                    
                
                    setFieldsData(prev => ({
                        ...prev,
                        [key]: {}
                    }));
                }
                    
                setFormFields(baseOsFields);
                showNotification('success', 'Dados adicionados na tabela');
            }
        }

    };
    const fetchData = async () => {
        try {
            showLoader()
            const [
                productsResponse,
                contractResponse,
                contractItemsResponse
            ] = await Promise.all([
                fetchProducts(entities.products.get, {deleted_at: false}),
                fetchContractById(entities.contracts.getByColumn(id), {deleted_at: false}),
                fetchContractItems(entities.contracts.items.get(id), {perPage: 0})
            ])
            
            const [addressesResponse] = await Promise.all([
                fetchAddressCustomer(entities.customers.addresses.get(contractResponse.result.customer_id), {deleted_at: false})
            ])

            setContract(contractResponse.result);
            setContractItems(contractItemsResponse.result.data);
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
            case "items.accessories":
                return accessories || [];
            case "items.address_id":
                return addresses || [];
            case "items.location_id":
                return locations || [];
            case "items.product_id":
                return products || [];
            case "items.excel":
                return [
                {
                    value: false,
                    label: 'Sim'
                },
                {
                    value: true,
                    label: 'Não'
                },
            ]
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
            let transformedData = {
                order: transformObjectValues(formData.order),
                items: transformValues(formData.items)
            }

            transformedData = {
                ...transformedData,
                items: transformedData.items.map(item => ({
                    ...item,
                    accessories: item.accessories ? item.accessories.map(accessory => accessory.value) : []
                }))
            };

            const success = await create(entities.contracts.orders.create(id) ,transformedData);
            if (success) {
                setFormData(setDefaultFieldValues(baseOsFields));
                setFormFields(baseOsFields);
                resetForm();
                fetchData();
            }
        } catch (error) {
            console.error('Erro ao criar status:', error);
        }
    };

    const handleFileFieldChange = async (fieldId, event, sectionField) => {
        const fileInput = event.target;
        const file = fileInput.files[0];
    
        if (!file) return;
        
        try {
            showLoader();
            const firstColumnData = await extractFirstColumnFromExcel(file);
            
            const response = await fetchProductsByIds(entities.products.create + '/find-by-number', firstColumnData);
            
            const data = response.result.map(product => ({
                value: product.id,
                label: product.name
            }));
    
            setFieldsData(prev => ({
                ...prev,
                items: {
                    ...prev.items,
                    product_id: data
                }
            }));
        } catch (error) {
            console.error("Erro ao processar o arquivo Excel:", error);
            fileInput.value = "";
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Ordem de Serviço" showBackButton={true} backUrl={`/contratos/${id}/ordens-servicos/`} />
            <DynamicHeaderForm 
                title={viewMode === "contract" ? "Detalhes do Contrato" : "Cadastro de Ordem de Serviço"} 
                options={options} 
                selectedOption={viewMode}
                onChange={setViewMode}
            />

            <div className="container-fluid p-1">
                {viewMode === "contract" ? (
                     <DynamicBoxForm title="Detalhes do Contrato">
                        <InfoBox 
                            data={[
                                { label: "Nome", value: contract?.name, icon: <FaUser /> },
                                { label: "Cliente", value: contract?.customer_name, icon: <FaRegAddressCard /> },
                                { label: "Organização", value: contract?.organization_name, icon: <FaBuilding /> }
                            ]}
                        />
                        <ContainerBox title="Lista de Equipamentos do Contrato">
                            {contractItems.length > 0 ? (
                                contractItems.map((contractItem) => (
                                    <div className='shadow-sm my-3 rounded p-2'>
                                        <div className='px-2 d-flex gap-3'>
                                            <ItemContainerBox
                                                item={{    
                                                    icon: <FaHashtag />,
                                                    label: 'Equipamento',
                                                    value: contractItem.item_id
                                                }}
                                            />
                                            <ItemContainerBox
                                                item={{
                                                    icon: <FaHashtag />,
                                                    label: 'Quantidade No Contrato',
                                                    value: contractItem.quantity
                                                }}
                                            />
                                            <ItemContainerBox
                                                item={{
                                                    icon: <FaHashtag />,
                                                    label: 'Quantidade Solicitadas Pelo o Cliente',
                                                    value: contractItem.quantity_request
                                                }}
                                            />
                                        </div>
                                        <ProgressBar progress={(contractItem.quantity_request / contractItem.quantity) * 100}/>
                                    </div>
                                ))
                            ):(
                                <h1>Sem items</h1>
                            )}
                        </ContainerBox>
                    </DynamicBoxForm>
                ) : (
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
                                            handleFileFieldChange={handleFileFieldChange}
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
                )}
            </div>
        </MainLayout>
    );
};

export default CreateContractOsPage;
