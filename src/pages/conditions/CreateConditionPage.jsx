import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import Form from '../../components/Form';
import { conditionFields } from '../../constants/forms/conditionFields';
import FormSection from '../../components/FormSection';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader'; 

const CreateConditionPage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(conditionFields));

    const handleSubmit = async () => {
        try {
            const success = await create(entities.conditions.create, formData);
            if (success) {
                resetForm(); 
            }
        } catch (error) {
            console.error('Erro ao cadastrar condição:', error);
        }
    };

    const handleBack = () => {
        navigate('/condicoes/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Condição" showBackButton backUrl="/condicoes/" />

            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                    initialFormData={formData}
                >
                    {() =>
                        conditionFields.map((section) => (
                            <FormSection
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

export default CreateConditionPage;
