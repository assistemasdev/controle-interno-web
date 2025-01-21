import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { contactFields } from '../../../constants/forms/contactFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useCustomerService from '../../../hooks/services/useCustomerService';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useContactService from '../../../hooks/services/useContactService';
import { entities } from '../../../constants/entities';

const CreateCustomerContactPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formData, resetForm, handleChange } = useForm(setDefaultFieldValues(contactFields));
    const { create, formErrors } = useContactService(entities.customers, id,navigate);

    const handleSubmit = async () => {
        showLoader()
        try {
            const success = await create(formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
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
