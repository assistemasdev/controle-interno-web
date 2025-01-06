import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { useNavigate } from 'react-router-dom';
import { unitFields } from '../../constants/forms/unitFields';
import useUnitService from '../../hooks/useUnitService';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';

const CreateUnitPage = () => {
    const navigate = useNavigate();
    const { createUnit, formErrors } = useUnitService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, initializeData } = useForm({
        name: '',
        abbreviation: '',
    });

    useEffect(() => {
        initializeData(unitFields);
    }, [unitFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await createUnit(formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [createUnit, formData, showLoader, hideLoader, showNotification, navigate]);

    const handleBack = useCallback(() => {
        navigate('/unidades');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Unidades
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar Unidade"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        unitFields.map((section) => (
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

export default CreateUnitPage;
