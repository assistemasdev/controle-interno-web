import React, { useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import Form from '../../components/Form';
import { conditionFields } from '../../constants/forms/conditionFields';
import FormSection from '../../components/FormSection';
import useConditionService from '../../hooks/useConditionService';
import useForm from '../../hooks/useForm';

const CreateConditionPage = () => {
    const navigate = useNavigate();
    const { createCondition, formErrors } = useConditionService(navigate);

    const { formData, handleChange, resetForm, initializeData } = useForm({});

    useEffect(() => {
        initializeData(conditionFields);
    }, [conditionFields]);

    const handleSubmit = async () => {
        try {
            await createCondition(formData);
            resetForm(); 
        } catch (error) {
            console.error('Erro ao cadastrar condição:', error);
        }
    };

    const handleBack = () => {
        navigate('/condicoes/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Condição
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
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
