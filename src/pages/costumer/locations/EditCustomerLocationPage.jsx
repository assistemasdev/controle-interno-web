import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import useCustomerService from '../../../hooks/services/useCustomerService';
import { locationFields } from '../../../constants/forms/locationFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const EditCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId, locationId } = useParams(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(locationFields));
    const { fetchCustomerLocation, updateLocation, formErrors } = useCustomerService(navigate);

    const fetchLocationData = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchCustomerLocation(id, addressId, locationId);
            formatData(response, locationFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, locationId, setFormData, showLoader, hideLoader, fetchCustomerLocation, showNotification]);

    useEffect(() => {
        fetchLocationData();
    }, [id, addressId, locationId]);

    const handleSubmit = useCallback(async () => {
        try {
            await updateLocation(id, addressId, locationId, formData);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao atualizar localização');
        }
    }, [id, addressId, locationId, formData, updateLocation, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    }, [id, addressId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Localização
                </div>

                <Form
                    handleBack={handleBack}
                    onSubmit={handleSubmit}
                    textSubmit='Editar'
                    textLoadingSubmit='Editando'
                    initialFormData={formData}
                >
                    {() => (
                        <>
                            {locationFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    handleFieldChange={handleChange}
                                    formData={formData}
                                    formErrors={formErrors}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditCustomerLocationPage;
