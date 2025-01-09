import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useConditionService from '../../hooks/useConditionService';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { conditionFields } from '../../constants/forms/conditionFields';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const EditConditionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getConditionById, updateCondition, formErrors } = useConditionService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(conditionFields));


    const fetchCondition = useCallback(async () => {
        showLoader();
        try {
            const data = await getConditionById(id);
            formatData(data, conditionFields);
        } catch (error) {
            showNotification('error', 'Erro ao buscar a condição.');
        } finally {
            hideLoader();
        }
    }, [id, getConditionById, formatData, conditionFields, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchCondition();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await updateCondition(id, formData);
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
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Condição
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
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

export default EditConditionPage;
