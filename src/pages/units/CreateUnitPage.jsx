import React, { useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { useNavigate } from 'react-router-dom';
import { unitFields } from '../../constants/forms/unitFields';
import useUnitService from '../../hooks/services/useUnitService';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const CreateUnitPage = () => {
    const navigate = useNavigate();
    const { create, formErrors } = useBaseService(entities.units,navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(unitFields));

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [create, formData, showLoader, hideLoader, showNotification, navigate]);

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
