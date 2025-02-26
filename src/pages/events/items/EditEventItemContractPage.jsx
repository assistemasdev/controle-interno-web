import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { eventItemFields } from '../../../constants/forms/eventItemFields';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const EditEventItemContractPage = () => {
    const navigate = useNavigate();
    const { id, eventId, eventItemId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(eventItemFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const contact = await fetchById(entities.contracts.events.items(id).getByColumn(eventId, eventItemId));
                formatData(contact.result, eventItemFields)
            } catch (error) {
                console.error(error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id, eventId, eventItemId]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.contracts.events.items(id).update(eventId, eventItemId), formData);
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
            <PageHeader title="Editar Item do Evento" showBackButton={true} backUrl={`/contratos/${id}/eventos/${eventId}/detalhes/`} /> 

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
                            {eventItemFields.map((section) => (
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

export default EditEventItemContractPage;
