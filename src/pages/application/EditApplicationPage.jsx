import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import PageHeader from '../../components/PageHeader';  
import '../../assets/styles/custom-styles.css';
import { applicationFields } from '../../constants/forms/applicationFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import SimpleForm from '../../components/forms/SimpleForm';

const EditApplicationPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(applicationFields));
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);

    const fetchData = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(entities.applications.getByColumn(id));
            formatData(response.result, applicationFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da aplicação.');
        } finally {
            hideLoader();
        }
    }, [id, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchData();
    }, [id, applicationFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await update(entities.applications.update(id), formData);
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao atualizar a aplicação.');
        } finally {
            hideLoader();
        }
    }, [id, formData, update, navigate, showLoader, hideLoader, showNotification]);

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
                title="Edição de Aplicação"
                showBackButton={true}  
                backUrl="/aplicacoes/dashboard"  
            />
            <div className="container-fluid p-1">

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        applicationFields.map((section) => (
                            <SimpleForm
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
