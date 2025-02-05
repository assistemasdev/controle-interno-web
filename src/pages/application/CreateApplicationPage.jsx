import React, { useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { applicationFields } from '../../constants/forms/applicationFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader'; 

const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(applicationFields));
    const { post: create, formErrors} = useBaseService(navigate);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(entities.applications.create, formData);

            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [formData, create, showNotification, navigate, showLoader, hideLoader]);

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
            <PageHeader
                title="Cadastro de Aplicações"
                showBackButton={true}  
                backUrl="/aplicacoes/dashboard"  
            />
            
            <div className="container-fluid p-1">
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
