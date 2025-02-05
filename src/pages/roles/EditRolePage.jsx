import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import useLoader from '../../hooks/useLoader';
import Form from '../../components/Form';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { roleFields } from '../../constants/forms/roleFields';
import FormSection from '../../components/FormSection';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditRolePage = () => {
    const navigate = useNavigate();
    const { roleId } = useParams();
    const { formData, formatData, handleChange } = useForm(setDefaultFieldValues(roleFields));
    const [permissions, setPermissions] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const { 
        get: fetchPermissions,
        get: fetchPermissionsForRole,
        getByColumn: fetchById, 
        put: update, 
        put: updateRolePermissions,
        formErrors 
    } = useBaseService(navigate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const [responseRole, responseRolePermissions, responsePermissions] = await Promise.all([
                    fetchById(entities.roles.getByColumn(roleId)),
                    fetchPermissionsForRole(entities.roles.permissions.getByColumn(roleId)),
                    fetchPermissions(entities.permissions.get)
                ]);
                
                const formattedPermissions = responsePermissions.result.data.map(permission => ({
                    value: permission.id,
                    label: permission.name
                }));
                
                setPermissions(formattedPermissions);  
                const responseAll = {
                    name: responseRole.result.name,
                    permissions: responseRolePermissions.result.map((option) => option.id)
                }

                formatData(responseAll, roleFields);
                
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            } finally {
                hideLoader();
            }
        };
    
        fetchData();
    }, [roleId])

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "permissions":
                return permissions || [];
            default:
                return [];
        }
    };

    const getSelectedValue = (fieldId) => {
        if (fieldId === "permissions") {
            if (Array.isArray(formData.permissions)) {
                return permissions.filter((permission) => formData.permissions.includes(permission.value));
            }
            return [];
        }
        return null;
    };

    const handleSubmit = async () => {
        try {
            const success = await update(entities.roles.getByColumn(roleId), formData);
            if (success) {
                await updateRolePermissions(entities.roles.permissions.update(roleId), {permissions: formData.permissions})
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
            <PageHeader title="Edição de Cargo" showBackButton={true} backUrl="/cargos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit='Editar'
                    textLoadingSubmit='Editando...'
                    handleBack={handleBack}
                >
                    {() => (
                        roleFields.map((section) => (
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
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditRolePage;
