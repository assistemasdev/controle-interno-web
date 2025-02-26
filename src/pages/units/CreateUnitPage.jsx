import React, { useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import '../../assets/styles/custom-styles.css';
import { useNavigate } from 'react-router-dom';
import { unitFields } from '../../constants/forms/unitFields';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import SimpleForm from '../../components/forms/SimpleForm';

const CreateUnitPage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(unitFields));

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(entities.units.create, formData);
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
            <PageHeader title="Cadastro de Unidades" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar Unidade"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        unitFields.map((section) => (
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

export default CreateUnitPage;
