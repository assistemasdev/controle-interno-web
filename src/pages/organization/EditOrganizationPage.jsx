import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { editOrganizationFields } from '../../constants/forms/organizationFields';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import colorToHex from '../../utils/colorToHex';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const EditOrganizationPage = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(editOrganizationFields));
    const { fetchById, update, formErrors } = useBaseService(entities.organizations, navigate)

    const handleFieldChange = useCallback((fieldId, value) => {
        if (fieldId === 'color') {
            const hexColor = colorToHex(value);
            setFormData((prev) => ({
                ...prev,
                color: hexColor,
            }));
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange, setFormData]);

    const getOptions = useCallback((fieldId) => {
        if (fieldId === 'active') {
            return [
                { label: 'Ativo', value: '1' },
                { label: 'Inativo', value: '0' },
            ];
        }
        return [];
    }, []);

    const getSelectedValue = useCallback((fieldId) => {
        if (fieldId === 'active') {
            return getOptions(fieldId).find(option => option.value === formData.active) || null;
        }
        return null;
    }, [formData, getOptions]);

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const response = await fetchById(organizationId);

                formatData(response.result, editOrganizationFields)
                setFormData(prev => ({
                    ...prev,
                    active: response.active ? '1' : '0'
                }))
            } catch (error) {
                navigate('/aplicacoes/dashboard');
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [organizationId]);

    const handleSubmit = useCallback(async () => {
        showLoader();
        try {
            await update(organizationId, formData.organization);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [formData, update, organizationId , navigate, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/dashboard`);
    }, [navigate, ]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Organização
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() => (
                        editOrganizationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditOrganizationPage;
