import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import { applicationFields } from '../../constants/forms/applicationFields';
import useApplicationService from '../../hooks/useApplicationService';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';

const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const { createApplication, formErrors } = useApplicationService(navigate);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, initializeData } = useForm({
        name: '',
        session_code: '',
    });

    useEffect(() => {
        initializeData(applicationFields);
    }, [applicationFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await createApplication(formData);
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
                                getOptions={() => []}
                                getSelectedValue={() => null}
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
