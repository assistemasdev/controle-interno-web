import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useForm from '../../hooks/useForm';
import useNotification from '../../hooks/useNotification';
import useCategoryService from '../../hooks/useCategoryService';
import useLoader from '../../hooks/useLoader';
import { categoryFields } from '../../constants/forms/categoryFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { fetchCategoryById, updateCategory, formErrors } = useCategoryService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(categoryFields));

    const fetchCategory = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchCategoryById(id);
            formatData(response, categoryFields);
        } catch (error) {
            if (error.status === 404) {
                showNotification('error', error.message || 'Categoria não encontrada.');
                navigate('/categorias/');
                return;
            }
            showNotification('error', 'Erro ao carregar a categoria.');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, fetchCategoryById, formatData, showLoader, hideLoader, showNotification, navigate]);

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await updateCategory(id, formData);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, formData, updateCategory, showNotification, showLoader, hideLoader]);

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
