import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import Form from '../../../../components/Form';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import useForm from '../../../../hooks/useForm';
import { associeteGroupFields } from '../../../../constants/forms/groupFields'
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import SimpleForm from '../../../../components/forms/SimpleForm';
const AttachGroupToTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { 
        get: fetchAll,
        get: fetchTypeGroups, 
        post: attachGroupToType, 
        formErrors
     } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [groups, setGroups] = useState([]);

    const { formData, handleChange, setFormData } = useForm(setDefaultFieldValues(associeteGroupFields));

    const fetchData = useCallback(async () => {
        try {
            showLoader();
            const [typeGroups, allGroups] = await Promise.all([
                fetchTypeGroups(entities.types.groups.get(id), {deleted_at: false}),
                fetchAll(entities.groups.get, {deleted_at: false}),
            ]);
            setFormData({
                groups: typeGroups.result.map((group) => group.id),
            });

            setGroups(allGroups.result.data.map((group) => ({
                value: group.id,
                label: group.name,
            })));
        } catch (error) {
            console.log(error)
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
            const message = await attachGroupToType(entities.types.groups.create(id), formData);
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
            <PageHeader title="Associar Grupos" showBackButton={true} backUrl="/tipos"/> 

            <div className="container-fluid p-1">
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
                            <SimpleForm
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
