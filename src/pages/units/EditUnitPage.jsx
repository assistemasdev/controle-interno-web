import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { unitFields } from '../../constants/forms/unitFields';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditUnitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(unitFields));

    useEffect(() => {
        const fetchUnitData = async () => {
            try {
                showLoader();
                const unit = await fetchById(entities.units.getByColumn(id));
                formatData(unit.result, unitFields);
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        };

        fetchUnitData();
    }, [id, unitFields]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await update(entities.units.update(id), formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, formData, update, showLoader, hideLoader, showNotification, navigate]);

    const handleBack = useCallback(() => {
        navigate('/unidades');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Unidade" showBackButton={true} backUrl="/dashboard" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
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

export default EditUnitPage;
