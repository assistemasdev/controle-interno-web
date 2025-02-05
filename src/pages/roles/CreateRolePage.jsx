import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { roleFields } from '../../constants/forms/roleFields';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader'; 

const CreateRolePage = () => {
    const navigate = useNavigate(); 
    const [permissions, setPermissions] = useState([]);
    const { formData, setFormData, resetForm, handleChange } = useForm(setDefaultFieldValues(roleFields));
    const { showNotification } = useNotification();
    const { 
        formErrors, 
        post: create,
        get: getPermissions
    } = useBaseService(navigate);

    useEffect(() => { 
        fetchPermissions();
    }, [])

    const fetchPermissions = async () => {
        try {
            const response = await getPermissions(entities.permissions.get);
            const formattedPermissions = response.result.data.map(permission => ({
                value: permission.id,
                label: permission.name
            }));
            setPermissions(formattedPermissions);  
        } catch (error) {
            console.error('Erro ao carregar permissões:', error);
            showNotification('error', 'error ao carregar permissões')
        }
    };

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);
        if (fieldId == 'permissions') {
            handlePermissionsChange(
                Array.isArray(value) ? value.map((val) => ({
                    value: val,
                    label: getOptions(fieldId).find((option) => option.value == val)?.label || "",
                }))
                : []
            )
        }
    }, [handleChange])

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "permissions":
                return permissions || [];
            default:
                return [];
        }
    };

    const handlePermissionsChange = useCallback((selectedOptions) => {
        const selectedValues = Array.isArray(selectedOptions)
            ? selectedOptions.map((option) => option.value)
            : [];
        setFormData((prev) => ({
            ...prev,
            permissions: selectedValues,
        }));
    }, []);

    const getSelectedValue = (fieldId) => {
        if (fieldId === "permissions") {
            if (Array.isArray(formData.permissions)) {
                return permissions.filter((group) => formData.permissions.includes(group.value));
            }
            return [];
        }
        return null;
    };


    const handleSubmit = async () => {
        try {
            const success = await create(entities.roles.create, formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleBack = () => {
        navigate('/cargos/');  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
             <PageHeader title="Cadastro de Cargo" showBackButton={true} backUrl="/cargos" />
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    handleBack={handleBack}
                    textSubmit='Cadastrar'
                    textLoadingSubmit='Cadastrando...'
                >
                    {() => (
                        roleFields.map((section) => (
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

export default CreateRolePage;
