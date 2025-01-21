import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import Form from '../../components/Form';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { roleFields } from '../../constants/forms/roleFields';
import usePermissionService from '../../hooks/services/usePermissionService';
import useRoleService from '../../hooks/services/useRoleService';
import FormSection from '../../components/FormSection';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const EditRolePage = () => {
    const navigate = useNavigate();
    const { roleId } = useParams();
    const { formData, formatData, handleChange } = useForm(setDefaultFieldValues(roleFields));
    const [permissions, setPermissions] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchPermissions } = usePermissionService(navigate);
    const {  fetchPermissionsForRole, updateRolePermissions } = useRoleService(navigate);
    const { fetchById, update, formErrors } = useBaseService(entities.roles, navigate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const [responseRole, responseRolePermissions, responsePermissions] = await Promise.all([
                    fetchById(roleId),
                    fetchPermissionsForRole(roleId),
                    fetchPermissions()
                ]);

                const formattedPermissions = responsePermissions.map(permission => ({
                    value: permission.id,
                    label: permission.name
                }));
                
                setPermissions(formattedPermissions);  

                const responseAll = {
                    name: responseRole.result.name,
                    permissions: responseRolePermissions.map((option) => option.id)
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
            const success = await update(roleId, formData);
            if (success) {
                await updateRolePermissions(roleId, {permissions: formData.permissions})
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
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Cargo
                </div>

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
