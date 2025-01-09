import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import useCategoryService from '../../hooks/useCategoryService';
import { categoryFields } from '../../constants/forms/categoryFields';
import FormSection from '../../components/FormSection';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const { createCategory, formErrors } = useCategoryService(navigate);

    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(categoryFields));

    const handleSubmit = async () => {
        try {
            const success = await createCategory(formData); 
            if (success) {
                resetForm(); 
            }
        } catch (error) {
            console.error('Erro ao cadastrar categoria:', error);
        }
    };

    const handleBack = () => {
        navigate('/categorias/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Categoria
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
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

export default CreateCategoryPage;
