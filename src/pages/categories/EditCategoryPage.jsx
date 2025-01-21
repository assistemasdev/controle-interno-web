import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useForm from '../../hooks/useForm';
import useNotification from '../../hooks/useNotification';
import useCategoryService from '../../hooks/services/useCategoryService';
import useLoader from '../../hooks/useLoader';
import { categoryFields } from '../../constants/forms/categoryFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { entities } from '../../constants/entities';
import useBaseService from '../../hooks/services/useBaseService';

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { fetchById, update, formErrors } = useBaseService(entities.categories, navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(categoryFields));

    const fetchCategory = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(id);
            formatData(response, categoryFields);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, fetchById, formatData, showLoader, hideLoader, showNotification, navigate]);

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await update(id, formData);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, formData, update, showNotification, showLoader, hideLoader]);

    const handleBack = useCallback(() => {
        navigate(`/categorias/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Categoria
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    initialFormData={formData}
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        categoryFields.map((field) => (
                            <FormSection
                                key={field.id}
                                section={field}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditCategoryPage;
