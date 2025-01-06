import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import '../../assets/styles/custom-styles.css';
import { unitFields } from '../../constants/forms/unitFields';
import useUnitService from '../../hooks/useUnitService';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';

const EditUnitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getUnitById, updateUnit, formErrors } = useUnitService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, initializeData } = useForm({
        name: '',
        abbreviation: '',
    });

    useEffect(() => {
        const fetchUnitData = async () => {
            try {
                showLoader();
                const unit = await getUnitById(id);
                initializeData(unitFields);
                setFormData({
                    name: unit.name,
                    abbreviation: unit.abbreviation || '',
                });
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
            await updateUnit(id, formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, formData, updateUnit, showLoader, hideLoader, showNotification, navigate]);

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
