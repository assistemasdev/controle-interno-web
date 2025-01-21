import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import { categoryFields } from '../../constants/forms/categoryFields';
import FormSection from '../../components/FormSection';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const { create, formErrors } = useBaseService(entities.categories, navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(categoryFields));

    const handleSubmit = async () => {
        try {
            const success = await create(formData); 
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
