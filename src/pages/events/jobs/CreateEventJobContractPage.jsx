import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { eventJobFields } from '../../../constants/forms/eventJobFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useBaseService from '../../../hooks/services/useBaseService';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const CreateEventJobContractPage = () => {
    const navigate = useNavigate();
    const { id, eventId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(eventJobFields));
    const { post: create, formErrors } = useBaseService(navigate);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(entities.contracts.events.jobs(id).create(eventId), formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao cadastrar serviço');
        } finally {
            hideLoader();
        }
    }, [create, id, eventId, formData, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/eventos/${eventId}/detalhes/`);
    }, [id, eventId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Serviço de Evento" showBackButton={true} backUrl={`/contratos/${id}/eventos/${eventId}/detalhes/`} />

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
                            {eventJobFields.map((section) => (
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

export default CreateEventJobContractPage;
