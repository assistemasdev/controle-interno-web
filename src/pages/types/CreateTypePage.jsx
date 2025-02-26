import React, { useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useForm from '../../hooks/useForm';
import { typeFields } from '../../constants/forms/typeFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import SimpleForm from '../../components/forms/SimpleForm';

const CreateTypePage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(typeFields));

    const handleSubmit = async () => {
        try {
            const success = await create(entities.types.create, formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar tipo:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate('/tipos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Tipos" showBackButton={true} backUrl="/tipos" /> 

            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        typeFields.map((section) => (
                            <SimpleForm
                                key={section.section}
                                section={section}
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

export default CreateTypePage;
