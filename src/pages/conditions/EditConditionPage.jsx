import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { conditionFields } from '../../constants/forms/conditionFields';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import SimpleForm from '../../components/forms/SimpleForm';

const EditConditionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(conditionFields));

    const fetchCondition = useCallback(async () => {
        showLoader();
        try {
            const data = await fetchById(entities.conditions.getByColumn(id));
            formatData(data.result, conditionFields);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, fetchById, formatData, conditionFields, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchCondition();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.conditions.update(id), formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate('/condicoes/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <PageHeader title="Edição de Condição" showBackButton backUrl="/condicoes/" />

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                    initialFormData={formData}
                >
                    {() =>
                        conditionFields.map((section) => (
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

export default EditConditionPage;
