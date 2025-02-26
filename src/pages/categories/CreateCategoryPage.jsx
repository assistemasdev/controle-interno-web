import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import { categoryFields } from '../../constants/forms/categoryFields';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader'; 
import SimpleForm from '../../components/forms/SimpleForm';

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(categoryFields));

    const handleSubmit = async () => {
        try {
            const success = await create(entities.categories.create, formData); 
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
            <PageHeader title="Cadastro de Categoria" showBackButton={true} backUrl="/categorias/" /> 
            
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                    initialFormData={formData}
                >
                    {() =>
                        categoryFields.map((field) => (
                            <SimpleForm
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
