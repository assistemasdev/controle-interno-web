import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useConditionService from '../../hooks/useConditionService';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { conditionFields } from '../../constants/forms/conditionFields';

const EditConditionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getConditionById, updateCondition, formErrors } = useConditionService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        const fetchCondition = async () => {
            showLoader();
            try {
                const data = await getConditionById(id);
                setFormData({ name: data.name });
            } catch (error) {
                showNotification('error', 'Erro ao buscar a condição.');
            } finally {
                hideLoader();
            }
        };

        fetchCondition();
    }, [id]);

    const handleSubmit = async (data) => {
        showLoader();
        try {
            await updateCondition(id, data);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
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
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
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

export default EditConditionPage;
