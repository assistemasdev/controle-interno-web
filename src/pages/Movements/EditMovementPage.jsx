import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import { editMovementsFields } from '../../constants/forms/movementFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditMovementPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData, setFormData } = useForm(setDefaultFieldValues(editMovementsFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const movementData = await fetchById(entities.movements.getByColumn(id));
                formatData(movementData.result, editMovementsFields);
                setFormData((prev) => ({
                    ...prev,
                    movement_date: movementData.result.movement_date.split(" ")[0]
                }));
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.movements.update(id), formData);
        } catch (error) {
            console.error('Erro ao atualizar o movimento:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/movimentos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Movimentos" showBackButton={true} backUrl="/movimentos" /> 
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        editMovementsFields.map((section) => (
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

export default EditMovementPage;
