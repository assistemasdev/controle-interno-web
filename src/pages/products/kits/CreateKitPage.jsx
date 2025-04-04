import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { kitFields } from '../../../constants/forms/kitFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SimpleBody from '../../../components/forms/SimpleBody';
import SectionHeader from '../../../components/forms/SectionHeader';

const CreateKitPage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(kitFields));

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const success = await create(entities.equipamentsKits.create, formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [create, formData, navigate, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate('/kits');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Kit" showBackButton={true} backUrl="/kits" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    className="p-3 mt-2 rounded shadow-sm mb-2"
                    textSubmit="Cadastrar Kit"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        kitFields.map((section) => (
                            <>
                             <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={false}
                                    setViewTable={() => {}}
                                    addFieldsInData={() => {}}
                            
                                />
                                <SimpleBody
                                    fields={section.fields}
                                    formErrors={formErrors}
                                    formData={formData}
                                    handleFieldChange={handleChange}
                                    getOptions={() => {}}
                                    getSelectedValue={() => {}}
                                />
                            </>
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateKitPage;
