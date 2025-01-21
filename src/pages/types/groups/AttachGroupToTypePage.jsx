import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useTypeGroupsService from '../../../hooks/services/useTypeGroupsService';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { associeteGroupFields } from '../../../constants/forms/groupFields'
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const AttachGroupToTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchTypeGroups, attachGroupToType, formErrors } = useTypeGroupsService(navigate);
    const { fetchAll } = useBaseService(entities.groups ,navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [groups, setGroups] = useState([]);

    const { formData, handleChange, setFormData } = useForm(setDefaultFieldValues(associeteGroupFields));

    const fetchData = useCallback(async () => {
        try {
            showLoader();
            const [typeGroups, allGroups] = await Promise.all([
                fetchTypeGroups(id),
                fetchAll({}),
            ]);

            setFormData({
                groups: typeGroups.map((group) => group.id),
            });

            setGroups(allGroups.result.data.map((group) => ({
                value: group.id,
                label: group.name,
            })));
        } catch (error) {
            showNotification('error', 'Erro ao carregar grupos.');
        } finally {
            hideLoader();
        }
    }, [id, associeteGroupFields]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = useCallback(async () => {
        try {
            showLoader();
            const message = await attachGroupToType(id, formData.groups);
            showNotification('success', message);
        } catch (error) {
            showNotification('error', 'Erro ao associar grupos.');
        } finally {
            hideLoader();
        }
    }, [attachGroupToType, id, formData.groups, showLoader, showNotification, hideLoader]);

    const getOptions = useCallback((fieldId) => {
        switch (fieldId) {
            case 'groups':
                return groups || [];
            default:
                return [];
        }
    }, [groups]);

    const getSelectedValue = useCallback((fieldId) => {
        if (fieldId === 'groups') {
            if (Array.isArray(formData.groups)) {
                return groups.filter((group) => formData.groups.includes(group.value));
            }
            return [];
        }
        return null;
    }, [formData.groups, groups]);

    const handleBack = useCallback(() => {
        navigate('/tipos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associar Grupos
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    className="p-3 mt-2 rounded shadow-sm mb-2"
                    textSubmit="Associar"
                    textLoadingSubmit="Associando..."
                    handleBack={handleBack}
                >
                    {() =>
                        associeteGroupFields.map((section) => (
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

export default AttachGroupToTypePage;
