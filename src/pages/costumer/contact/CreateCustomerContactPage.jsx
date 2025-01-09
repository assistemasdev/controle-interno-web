import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { contactFields } from '../../../constants/forms/contactFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useCustomerService from '../../../hooks/useCustomerService';

const CreateCustomerContactPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, initializeData, resetForm, handleChange } = useForm({});
    const { createContact, formErrors } = useCustomerService(navigate);

    useEffect(() => {
        initializeData(contactFields)
    }, [contactFields]);

    const handleSubmit = async () => {
        showLoader()
        try {
            await createContact(id, formData);
            resetForm();
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao criar contato');
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Contato do Fornecedor
                </div>

                <Form
                    handleBack={handleBack}
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit='Cadastrar'
                    textLoadingSubmit='Cadastrando'
                >
                    {() => (
                        <>
                            {contactFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    handleFieldChange={handleChange}
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

export default CreateCustomerContactPage;
