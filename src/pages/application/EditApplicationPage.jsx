import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { applicationFields } from '../../constants/forms/applicationFields';
import useApplicationService from '../../hooks/useApplicationService';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';

const EditApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getApplicationById, updateApplication, formErrors } = useApplicationService(navigate);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, initializeData } = useForm({
        name: '',
        session_code: '',
        active: '',
    });

    const fetchData = useCallback(async () => {
        try {
            showLoader();
            const application = await getApplicationById(id);
            initializeData(applicationFields);
            setFormData({
                name: application.name,
                session_code: application.session_code,
                active: application.active,
            });
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da aplicação.');
        } finally {
            hideLoader();
        }
    }, [id, getApplicationById, initializeData, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await updateApplication(id, formData);
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao atualizar a aplicação.');
        } finally {
            hideLoader();
        }
    }, [id, formData, updateApplication, navigate, showLoader, hideLoader, showNotification]);

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
                    Edição de Aplicação
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
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

export default EditApplicationPage;
