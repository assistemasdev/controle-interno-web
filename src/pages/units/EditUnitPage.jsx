import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { unitFields } from '../../constants/forms/unitFields';
import useUnitService from '../../hooks/services/useUnitService';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const EditUnitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchById, update, formErrors } = useBaseService(entities.units,navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(unitFields));

    useEffect(() => {
        const fetchUnitData = async () => {
            try {
                showLoader();
                const unit = await fetchById(id);
                formatData(unit, unitFields);
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
            await update(id, formData);
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
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Unidade
                </div>

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
