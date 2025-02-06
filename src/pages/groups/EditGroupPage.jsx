import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { groupFields } from '../../constants/forms/groupFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditGroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(groupFields));

    const fetchGroup = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(entities.groups.getByColumn(id));
            formatData(response.result, groupFields);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchGroup();
    }, [id]);

    const handleSubmit = async () => {
        try {
            showLoader();
            await update(entities.groups.getByColumn(id), formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/grupos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Grupo" showBackButton={true} backUrl="/grupos" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        groupFields.map((section) => (
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

export default EditGroupPage;
