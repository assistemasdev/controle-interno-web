import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { applicationFields } from '../../constants/forms/applicationFields';
import useApplicationService from '../../hooks/useApplicationService';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const { createApplication, formErrors } = useApplicationService(navigate);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(applicationFields));
    
    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await createApplication(formData);

            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao cadastrar a aplicação.');
        } finally {
            hideLoader();
        }
    }, [formData, createApplication, showNotification, navigate, showLoader, hideLoader]);

    const handleBack = useCallback(() => {
        navigate('/aplicacoes/dashboard');
    }, [navigate]);

    const getOptions = useCallback((fieldId) => {
        const field = applicationFields[0].fields.find((f) => f.id === fieldId);
        return field?.options || [];
    }, []);

    const getSelectedValue = useCallback((fieldId) => {
        const field = applicationFields[0].fields.find((f) => f.id === fieldId);
        if (field && field.type === 'select') {
            return getOptions(fieldId).find((option) => option.value === formData[fieldId]) || null;
        }
        return null;
    }, [formData, getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Aplicações
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        applicationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateApplicationPage;
