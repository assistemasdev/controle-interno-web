import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useTypeService from '../../hooks/useTypeService';
import useForm from '../../hooks/useForm';
import { typeFields } from '../../constants/forms/typeFields';

const CreateTypePage = () => {
    const navigate = useNavigate();
    const { createType, formErrors } = useTypeService();

    const { formData, handleChange, initializeData } = useForm({
        name: '',
    });

    const handleSubmit = async () => {
        try {
            await createType(formData);
        } catch (error) {
            console.error('Erro ao criar tipo:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate('/tipos');
    }, [navigate]);

    useEffect(() => {
        initializeData(typeFields);
    }, [typeFields]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Tipos
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        typeFields.map((section) => (
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

export default CreateTypePage;
