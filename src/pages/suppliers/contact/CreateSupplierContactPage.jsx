import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { contactFields } from '../../../constants/forms/contactFields';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useSupplierService from '../../../hooks/useSupplierService';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const CreateSupplierContactPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { createSupplierContact, formErrors } = useSupplierService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(contactFields));

    const handleSubmit = async () => {
        showLoader();
        try {
            const success = await createSupplierContact(id, formData);

            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao cadastrar contato.');
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Contato do Fornecedor
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
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

export default CreateSupplierContactPage;
