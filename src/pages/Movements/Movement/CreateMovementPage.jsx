import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import Form from '../../../components/Form'; 
import { baseMovementFields, dynamicFields } from "../../../constants/forms/movementFields";
import { transformObjectValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../../utils/objectUtils';
import SectionHeader from '../../../components/forms/SectionHeader';
import TableBody from '../../../components/forms/TableBody';
import SimpleBody from '../../../components/forms/SimpleBody';
import { v4 as uuidv4 } from 'uuid';
import DynamicHeaderForm from '../../../components/forms/DynamicHeaderForm';
import DynamicBoxForm from '../../../components/forms/DynamicBoxForm';
import { FaFingerprint, FaInfoCircle, FaClock, FaBox, FaFileContract, FaCubes, FaHashtag, FaBuilding, FaMapMarkerAlt , FaUser, FaUserTie, FaMap  } from 'react-icons/fa';
import InfoBox from '../../../components/box/InfoBox';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FlatListBox from '../../../components/box/FlatListBox';
import AccessoriesListBox from '../../../components/box/AccessoriesListBox';
import Select from "react-select";
import FieldList from '../../../components/forms/FieldList';

dayjs.extend(customParseFormat);

const CreateMovementPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchItemsOrdersServices,
        get: fetchOrdersServices,
        getByColumn: fetchOrderServiceItemById,
        getByColumn: fetchContractById,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm({});
    const [itemsOrdersServices, setItemsOrdersServices] = useState([]);
    const [reloadForm, setReloadForm] = useState(false);
    const [formFields, setFormFields] = useState(baseMovementFields);
    const [viewTable, setViewTable] = useState({});
    const [headers, setHeaders] = useState({});
    const [fieldsData, setFieldsData] = useState({})
    const [viewMode, setViewMode] = useState("form");
    const [ordersServices, setOrdersServices] = useState([]);
    const [filters, setFilters] = useState({
        deadline: null,
        customer: null,
        orderId: null
    });
    
    const options = [
        { value: "form", label: "Formulário" },
        { value: "orderService", label: "Requisições" },
    ];

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

    const getMovementTypeIdAndProductId = async (id) => {
        try {
            showLoader()
            const response = await fetchOrderServiceItemById(entities.orders.items.getByColumn(formData.movement.service_order_id.value, id))
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
    
            const osId = formData.movement?.service_order_id?.value;
            if (!osId) return;
    
            const response = await fetchItemsOrdersServices(
                entities.orders.items.get(osId),
                { deleted_at: false, perPage: 0 }
            );
    
            setItemsOrdersServices(response.result.data.map((item) => ({
                value: item.id,
                label: item.id
            })));
    
            const serviceOrderItems = response.result.data;
    
            const newFieldsData = {
                items: [],
                exclude_ids: {}
            };
    
            let globalIndex = 0; 
    
            const dynamicSections = [];
    
            for (const item of serviceOrderItems) {
                console.log(item)
                const quantity = Number(item.fulfilled_quantity);
                for (let i = 0; i < quantity; i++) {
                    const dynamic = dynamicFields[item.movement_type_id];
                    if (!dynamic) continue;
    
                    const fields = dynamic.fields.map((field) => {
                        const fieldId = field.id.replace(/^items\./, `items[${globalIndex}].`);
    
                        let value = null;
                        if (field.id === 'items.service_order_item_id') {
                            value = { value: item.id, label: '' };
                        } else if (field.id === 'items.product_id') {
                            value = item.product_id ? { value: item.product_id, label: item.product_name } : { value: '', label: '' };
                        } else if (field.id === 'items.movement_type_id') {
                            value = { value: item.movement_type_id, label: item.movement_type_name };
                        } else if (field.id === 'items.contract_item_id') {
                            value = item.contract_item_id ? { value: item.contract_item_id, label: item.contract_item_id } : { value: '', label: '' };
                        }
    
                        return {
                            ...field,
                            id: fieldId,
                            value
                        };
                    });
    
                    dynamicSections.push({
                        ...dynamic,
                        section: `Produto`,
                        fields
                    });
    
                    fields.forEach(field => {
                        const match = field.id.match(/^items\[(\d+)\]\.(.+)$/);
                        if (!match) return;
                        const fieldKey = match[2];
    
                        if (!newFieldsData.items[globalIndex]) {
                            newFieldsData.items[globalIndex] = {};
                        }
    
                        newFieldsData.items[globalIndex][fieldKey] = field.value;
                    });
    
                    newFieldsData.items[globalIndex].identify = uuidv4().slice(0, 8);
    
                    globalIndex++;
                }
            }
    
            setFieldsData(newFieldsData);
    
            setFormFields([
                ...baseMovementFields,
                ...dynamicSections
            ]);
    
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
            showNotification('error', errorMessage);
            console.error('Erro no carregamento dos dados:', error);
        } finally {
            hideLoader();
        }
    };
    const fetchCustomerAndOrganization = async () => {
        try {
            showLoader();
            if(formData.movement?.service_order_id.value) {
                const response = await fetchOrderServiceItemById(entities.orders.getByColumn(formData.movement.service_order_id.value), {deleted_at: false})
                const responseContract = await fetchContractById(entities.contracts.getByColumn(response.result.contract_id));
                setFormData(prev => ({
                    ...prev,
                    movement: {
                        ...prev.movement,
                        customer_id: {value: responseContract.result.customer_id, label:""},
                        organization_id: {value:responseContract.result.organization_id, label:""}
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

    const normalizeFieldId = (fieldId) => {
        return fieldId.replace(/\[\d+\]/, '');
    };

    const getOptions = (fieldId) => {
        const normalizedId = normalizeFieldId(fieldId);
        switch (normalizedId) {
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
                movement: transformObjectValues(formData.movement),
                items: transformValues(Array.isArray(fieldsData.items)? fieldsData.items.map((item) => removeEmptyValues(item)) : [])
            }

            const success = await create(entities.movements.create, transformedData);
            if (success) {
                resetForm();
                setFormData(prev => ({
                    ...prev,
                    items: []
                }))
                setFieldsData({})
                setFormFields(baseMovementFields)
                fetchData();
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            showLoader();
            const response = await fetchOrdersServices(entities.orders.get, {
                status_id: [1, 2],
                sort: [{ key: 'deadline', direction: 'asc' }],
                perPage: 0
            });
            const orders = response.result.data;
            const ordersWithItems = await Promise.all(
                orders.map(async order => {
                    const itemsResponse = await fetchItemsOrdersServices(
                        entities.orders.items.get(order.id),
                        { status_id: [1, 2] }
                    );
                    const orderItems = itemsResponse.result.data;

                    const itemsWithAccessories = await Promise.all(
                        orderItems.map(async item => {
                            try {
                                const accessoriesResponse = await fetchItemsOrdersServices(
                                    entities.orders.items.getByColumn(order.id, item.id) + '/accessories',
                                    {}
                                );
                                return {
                                    ...item,
                                    accessories: accessoriesResponse.result
                                };
                            } catch (err) {
                                console.error(`Erro ao buscar acessórios do item ${item.id}:`, err);
                                return { ...item, accessories: [] };
                            }
                        })
                    );

                    return { ...order, items: itemsWithAccessories };
                })
            );
            setOrdersServices(ordersWithItems);
            
        } catch (error) {
            console.log(error);
        } finally {
            hideLoader();
        }
    };

    const filteredOrders = useMemo(() => {
        return ordersServices.filter(order => {
            const deadlineDate = dayjs(order.deadline, 'DD/MM/YYYY');
            const now = dayjs();
    
            const matchDeadline = !filters.deadline || (
                filters.deadline.value === "late" && deadlineDate.isBefore(now, 'day')
            ) || (
                filters.deadline.value === "onTime" && !deadlineDate.isBefore(now, 'day')
            );
    
            const matchCustomer = !filters.customer || order.customer_name === filters.customer.value;
            const matchOrderId = !filters.orderId || order.id === filters.orderId.value;
    
            return matchDeadline && matchCustomer && matchOrderId;
        });
    }, [ordersServices, filters]);
    
    
    const checkDeadline = (deadline)  => {
        if (!deadline) return '';

        const deadlineDate = dayjs(deadline, 'DD/MM/YYYY');
      
        const now = dayjs();
      
        return deadlineDate.isBefore(now, 'day') ? 'Atrasada' : 'No prazo';
    }

    const handleDeleteSection = (indexToRemove) => {
        setFormFields((prevFields) =>
            prevFields.filter((_, idx) => idx !== indexToRemove + 1)
        );
        setFieldsData((prevFieldsData) => {
            const updatedItems = prevFieldsData.items.filter((_, idx) => idx !== indexToRemove);
            return {
                ...prevFieldsData,
                items: updatedItems
            };
        });
    };
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Movimento" showBackButton={true} backUrl="/movimentos" />
            <DynamicHeaderForm 
                options={options} 
                selectedOption={viewMode}
                onChange={setViewMode}
            />

            <div className="container-fluid p-1">
                {viewMode === "orderService" ? (
                    <DynamicBoxForm title="Requisições">
                        <div className="row mb-4">
                            <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <Select
                                    placeholder="Filtrar por Prazo"
                                    options={[
                                        { value: "late", label: "Atrasada" },
                                        { value: "onTime", label: "No Prazo" }
                                    ]}
                                    value={filters.deadline}
                                    onChange={selected => setFilters(prev => ({ ...prev, deadline: selected }))}
                                    isClearable
                                />
                            </div>
                            <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <Select
                                    placeholder="Filtrar por Cliente"
                                    options={[...new Set(ordersServices.map(order => order.customer_name))]
                                        .filter(Boolean)
                                        .map(name => ({ value: name, label: name }))
                                    }
                                    value={filters.customer}
                                    onChange={selected => setFilters(prev => ({ ...prev, customer: selected }))}
                                    isClearable
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <Select
                                    placeholder="Filtrar por Ordem de Serviço"
                                    options={ordersServices.map(order => ({
                                        value: order.id,
                                        label: `OS #${order.id}`
                                    }))}
                                    value={filters.orderId}
                                    onChange={selected => setFilters(prev => ({ ...prev, orderId: selected }))}
                                    isClearable
                                />
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <p className="text-center text-muted">Nenhuma requisição encontrada.</p>
                        ) : (
                        filteredOrders.map((order, index) => (
                            <div className='shadow-sm p-2 mb-3 rounded' style={{ border: "1px solid #dee2e6" }} key={order.id}>
                                <InfoBox 
                                    data={[
                                        { label: "Ordem de Serviço", value: order?.id, icon: <FaFingerprint /> },
                                        { label: "Status", value: order?.status, icon: <FaInfoCircle /> },
                                        { 
                                            label: "Prazo", 
                                            value: `${order?.deadline} (${checkDeadline(order?.deadline)})`, 
                                            icon: <FaClock /> 
                                        },
                                        { label: "Departamento", value: order?.departament_name, icon: <FaBuilding /> },
                                        { label: "Destino", value: order?.destination_name, icon: <FaMapMarkerAlt /> },
                                        { label: "Responsável Pela Requisição", value: order?.user_name, icon: <FaUser /> },
                                        { label: "Cliente do Contrato", value: order?.customer_name, icon: <FaUserTie /> }
                                    ]}
                                />
                                {order.items &&
                                    order.items.map((item, idx) => (
                                        <div key={item.id || idx}>
                                            <FlatListBox
                                                title={'Tipo de Movimento: ' + (item.movement_type_name || "Item")}
                                                data={[
                                                    { label: "Ordem de Serviço Item", value: item.id, icon: <FaHashtag /> },
                                                    { label: "Produto", value: item.product_name, icon: <FaBox /> },
                                                    {
                                                        label: "Contrato Item",
                                                        value: !item.product_name ? item.contract_item_id : null,
                                                        icon: <FaFileContract />
                                                    },
                                                    { label: "Quantidade", value: item.fulfilled_quantity, icon: <FaCubes /> },
                                                    { label: "Detalhes", value: item.details, icon: <FaInfoCircle /> },
                                                    item.address_name && {
                                                        label: "Endereço",
                                                        value: item.address_name,
                                                        icon: <FaMapMarkerAlt />
                                                    },
                                                    item.location_name && {
                                                        label: "Localização",
                                                        value: item.location_name,
                                                        icon: <FaMap />
                                                    }
                                                ].filter(Boolean)}
                                                accessories={item.accessories?.length > 0 && (
                                                    <AccessoriesListBox accessories={item.accessories} />
                                                )}
                                            />
                                        </div>
                                    ))
                                }
                </div>
            ))
        )}
    </DynamicBoxForm>
                ) : (
                    <Form
                        initialFormData={formData}
                        onSubmit={handleSubmit}
                        textSubmit="Cadastrar"
                        textLoadingSubmit="Cadastrando..."
                        handleBack={handleBack}
                    >
                        {() => {
                            const renderedSections = new Set();

                            return formFields.map((section, index) => {
                                const sectionType = section.section.split(' - ')[0]; // Ex: "Produto"
                                const showHeader = !renderedSections.has(sectionType);

                                if (showHeader) {
                                    renderedSections.add(sectionType);
                                }

                                return (
                                    <div key={section.section + ' ' + index}>
                                        {showHeader && (
                                            <SectionHeader
                                                section={section}
                                                viewTable={viewTable}
                                                setViewTable={setViewTable}
                                                addFieldsInData={addFieldsInData}
                                            />
                                        )}

                                        {section.view === "fields" ? (
                                            <FieldList
                                                section={section}
                                                index={index - 1}
                                                formData={formData}
                                                setFormData={setFormData}
                                                getOptions={getOptions}
                                                getSelectedValue={getSelectedValue}
                                                formErrors={formErrors}
                                                fieldsData={fieldsData}
                                                setFieldsData={setFieldsData}
                                                onDelete={handleDeleteSection}
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
                                    </div>
                                );
                            });
                        }}
                    </Form>

                )}

            </div>
        </MainLayout>
    );
};

export default CreateMovementPage;
