import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import FormSection from '../../../../components/FormSection';
import { shipmentFields } from "../../../../constants/forms/shipmentFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import { transformValues, removeEmptyValues } from '../../../../utils/objectUtils';

const CreateMovementsShipmentsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        get: fetchMovementsItems,
        getByColumn: fetchMovementById,
        get: fetchAddresses,
        get: fetchLocations,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData } = useForm(setDefaultFieldValues(shipmentFields));
    const [allFieldsData, setAllFieldsData] = useState({});
    const [movementsItems, setMovementsItems] = useState([])
    const [addresses, setAddresses] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [locations, setLocations] = useState([]);
    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            items: []
        }))

        const fetchData = async () => {
            try {
                showLoader();

                const [
                    responseMovement,
                ] = await Promise.all([
                    fetchMovementById(entities.movements.getByColumn(id)),
                ]);

                const addressesReponse = await fetchAddresses(entities.customers.addresses.get(responseMovement.result.customer_id));
                setCustomerId(responseMovement.result.customer_id);
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
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchLocationsData()
    }, [allFieldsData?.items?.address_id])
    
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            shipment: {
                ...prev.shipment,
                movement_id: id
            }
        }))
    }, [])
    
    const fetchLocationsData = async () => {
        try {
            showLoader()
            if (allFieldsData?.items?.address_id) {
                const response = await fetchLocations(entities.customers.addresses.locations(customerId).get(allFieldsData?.items?.address_id?.value), {deleted_at: false});
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
                        shipmentFields.map((section) => (
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
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateMovementsShipmentsPage;
