import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { contactFields } from '../../../constants/forms/contactFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const EditCustomerContactPage = () => {
    const navigate = useNavigate();
    const { id, contactId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(contactFields));
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(entities.customers, id, navigate);

    useEffect(() => {
        fetchContact();
    }, [id, contactId]);

    const fetchContact = async () => {
        try {
            showLoader();
            const response = await fetchById(entities.customers.contacts.getByColumn(id,contactId));
            formatData(response.result, contactFields)
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await update(entities.customers.contacts.update(id,contactId), formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Contato do Cliente" showBackButton={true} backUrl={`/clientes/detalhes/${id}`} />

            <div className="container-fluid p-1">
                <Form 
                    handleBack={handleBack}
                    onSubmit={handleSubmit}
                    textSubmit='Cadastrar'
                    textLoadingSubmit='Cadastrando...'
                    initialFormData={formData}
                >
                    {() => (
                        <>
                            {contactFields.map((section) => (
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

export default EditCustomerContactPage;
