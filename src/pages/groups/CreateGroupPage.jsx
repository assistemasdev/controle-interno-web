import React, { useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useGroupService from '../../hooks/useGroupService';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { groupFields } from '../../constants/forms/groupFields';

const CreateGroupPage = () => {
    const navigate = useNavigate();
    const { createGroup, formErrors } = useGroupService(navigate);
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();

    const { formData, handleChange, initializeData } = useForm({
        name: '',
    });

    const memoizedFields = useMemo(() => groupFields, []);

    useEffect(() => {
        initializeData(memoizedFields);
    },  [memoizedFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await createGroup(formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [createGroup, formData, navigate, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate('/grupos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Grupo
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    className="p-3 mt-2 rounded shadow-sm mb-2"
                    textSubmit="Cadastrar Grupo"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        memoizedFields.map((section) => (
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

export default CreateGroupPage;
