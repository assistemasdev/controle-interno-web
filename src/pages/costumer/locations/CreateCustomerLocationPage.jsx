import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { locationFields } from '../../../constants/forms/locationFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useCustomerService from '../../../hooks/useCustomerService';

const CreateCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, initializeData, handleChange } = useForm({});
    const { createLocation, formErrors } = useCustomerService(navigate);

    useEffect(() => {
        initializeData(locationFields);
    }, [locationFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await createLocation(id, addressId, formData);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao cadastrar localização');
        } finally {
            hideLoader();
        }
    }, [createLocation, id, addressId, formData, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    }, [id, addressId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Localização
                </div>

                <Form
                    handleBack={handleBack}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <>
                            {locationFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    formErrors={formErrors}
                                    handleFieldChange={handleChange}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateCustomerLocationPage;
