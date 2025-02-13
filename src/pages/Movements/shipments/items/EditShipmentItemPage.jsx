import React, { useEffect, useCallback, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import FormSection from '../../../../components/FormSection';
import { shipmentItemFields } from "../../../../constants/forms/shipmentItemFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const EditShipmentItemPage = () => {
    const { id, shipmentId, shipmentItemId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        put: update, 
        getByColumn: fetchShipmentItemById,
        get: fetchMovementsItems,
        getByColumn: fetchMovementById,
        get: fetchAddresses,
        get: fetchLocations,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData, formatData } = useForm(setDefaultFieldValues(shipmentItemFields));
    const [allFieldsData, setAllFieldsData] = useState({});
    const [movementsItems, setMovementsItems] = useState([])
    const [addresses, setAddresses] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [locations, setLocations] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();

                const [
                    response,
                    responseMovement,
                ] = await Promise.all([
                    fetchShipmentItemById(entities.movements.shipments.items(id).getByColumn(shipmentId, shipmentItemId)),
                    fetchMovementById(entities.movements.getByColumn(id)),
                ]);
                const addressesReponse = await fetchAddresses(entities.customers.addresses.get(responseMovement.result.customer_id));
                setCustomerId(responseMovement.result.customer_id);
                formatData(response.result, shipmentItemFields);

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
    }, [formData.address_id])
        

    const fetchLocationsData = async () => {
        try {
            showLoader()
            if(formData.address_id && customerId) {
                const response = await fetchLocations(entities.customers.addresses.locations(customerId).get(formData.address_id), {deleted_at: false});
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
            case "address_id":
                return addresses || [];
            case "location_id":
                return locations || [];
            default:
                return [];
        }
    };
    
    const getSelectedValue = (fieldId) => {
        if (fieldId) {
            const value = formData[fieldId];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.movements.shipments.items(id).update(shipmentId, shipmentItemId), formData);
        } catch (error) {
            console.error('Error editing movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/${id}/carregamentos/${shipmentId}/detalhes/`);  
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Item do Carregamento" showBackButton={true} backUrl={`/movimentos/${id}/carregamentos/${shipmentId}/detalhes/`}/>
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                >
                    {() => 
                        shipmentItemFields.map((section) => (
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

export default EditShipmentItemPage;
