import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import '../../../assets/styles/custom-styles.css';
import { unitAssociationFields } from '../../../constants/forms/unitFields';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const AttachUnitsRelatedPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { get: fetchAll, get:fetchAttachedUnits, post: syncRelatedUnits, formErrors } = useBaseService(entities.units, navigate)
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData } = useForm(setDefaultFieldValues(unitAssociationFields));
    const [units, setUnits] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            showLoader();

            const [allUnits, attachedUnits] = await Promise.all([
                fetchAll(entities.units.get),
                fetchAttachedUnits(entities.units.units.get(id)),
            ]);

            setUnits(allUnits.result.data.map((unit) => ({
                value: unit.id,
                label: unit.name
            })))

            setFormData({
                units: attachedUnits.result.map((unit) => unit.id),
            });
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, fetchAll, fetchAttachedUnits, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            await syncRelatedUnits(entities.units.units.create(id), formData);
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao associar unidades.');
        } finally {
            hideLoader();
        }
    }, [id, formData.units, syncRelatedUnits, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate('/unidades');
    }, [navigate]);

    const getOptions = useCallback((fieldId) => {
        if (fieldId === 'units') {
            return units || [];
        }
        return [];
    }, []);

    const getSelectedValue = useCallback((fieldId) => {
        if (fieldId === 'units' && Array.isArray(formData.units)) {
            return units.filter((unit) => formData.units.includes(unit.value));
        }
        return [];
    }, [formData.units, units]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associar Unidades Relacionadas
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    className="p-3 mt-2 rounded shadow-sm mb-2"
                    textSubmit="Associar Unidade"
                    textLoadingSubmit="Associando..."
                    handleBack={handleBack}
                >
                    {() =>
                        unitAssociationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            
            </div>
        </MainLayout>
    );
};

export default AttachUnitsRelatedPage;
