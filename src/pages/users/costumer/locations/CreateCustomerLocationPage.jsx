import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import useForm from '../../../../hooks/useForm';
import { locationFields } from '../../../../constants/forms/locationFields';
import Form from '../../../../components/Form';
import FormSection from '../../../../components/FormSection';
import useBaseService from '../../../../hooks/services/useBaseService';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const CreateCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(locationFields));
    const { post: create, formErrors } = useBaseService(navigate);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(entities.customers.addresses.locations(id).create(addressId), formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [create, id, addressId, formData, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    }, [id, addressId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Localização" showBackButton={true} backUrl={`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`} />

            <div className="container-fluid p-1">
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
