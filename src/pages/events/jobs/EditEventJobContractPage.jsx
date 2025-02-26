import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { eventJobFields } from '../../../constants/forms/eventJobFields';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const EditEventJobContractPage = () => {
    const navigate = useNavigate();
    const { id, eventId, eventJobId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(eventJobFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const contact = await fetchById(entities.contracts.events.jobs(id).getByColumn(eventId, eventJobId));
                formatData(contact.result, eventJobFields)
            } catch (error) {
                console.error(error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id, eventId, eventJobId]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.contracts.events.jobs(id).update(eventId, eventJobId), formData);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/contratos/${id}/eventos/${eventId}/detalhes/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Serviço do Evento" showBackButton={true} backUrl={`/contratos/${id}/eventos/${eventId}/detalhes/`} /> 

            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
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

export default EditEventJobContractPage;
