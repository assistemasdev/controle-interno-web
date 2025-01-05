import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import ConditionService from '../../services/ConditionService';
import Form from '../../components/Form';
import { conditionFields } from '../../constants/forms/conditionFields';
import FormSection from '../../components/FormSection';
import useConditionService from '../../hooks/useConditionService';

const CreateConditionPage = () => {
    const navigate = useNavigate(); 
    const { createCondition, formErrors } = useConditionService(navigate)
    const [formData, setFormData] = useState({
        name: ''
    })
    const handleSubmit = async (formData) => {    
        try {
            await createCondition(formData);
        } catch (error) {
            console.log(error)
        }
    };

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleBack = () => {
        navigate(`/condicoes/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Condição
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
                        conditionFields.map((field) => (
                            <FormSection
                                key={field.section}
                                section={field}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                            />
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateConditionPage;
