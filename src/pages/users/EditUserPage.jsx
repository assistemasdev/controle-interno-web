import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useUserService from '../../hooks/useUserService';
import Select from 'react-select';
import useLoader from '../../hooks/useLoader';
import usePermissionService from '../../hooks/usePermissionService';
import useRoleService from '../../hooks/useRoleService';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const EditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formErrors, fetchUserById, updateUser } = useUserService(navigate);
    const { roles, fetchRoles, fetchPermissionsForRole } = useRoleService();
    const { permissions, fetchPermissions, fetchPermissionsForUser, updateUserPermissions } = usePermissionService();

    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(userProfileFields));

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [oldSelectedRoles, setOldSelectedRoles] = useState([]);

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const user = await fetchUserById(id);
            formatData(user, userProfileFields);

            const [rolesData, permissionsData, userPermissions] = await Promise.all([
                fetchRoles(),
                fetchPermissions(),
                fetchPermissionsForUser(id),
            ]);

            setSelectedPermissions(userPermissions.map((p) => p.id));

            const userRoles = user.roles || [];
            setSelectedRoles(userRoles.map((r) => ({ value: r.id, label: r.name })));
            setOldSelectedRoles(userRoles.map((r) => r.id));
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            hideLoader();
        }
    }, [id, fetchUserById, fetchRoles, fetchPermissions, fetchPermissionsForUser, formatData, showLoader, hideLoader]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleRoleChange = async (selectedOptions) => {
        const safeSelectedOptions = selectedOptions || [];
        const safeOldSelectedRoles = oldSelectedRoles || [];

        const addedRoles = safeSelectedOptions.filter((option) => !safeOldSelectedRoles.includes(option.value));
        const removedRoles = safeOldSelectedRoles.filter((role) => !safeSelectedOptions.some((option) => option.value === role));

        if (addedRoles.length > 0) {
            for (const addedRole of addedRoles) {
                const response = await fetchPermissionsForRole(addedRole.value);
                const permissionsFromRole = response || [];

                setSelectedPermissions((prevPermissions) => {
                    const updatedPermissions = [...prevPermissions];
                    permissionsFromRole.forEach((permission) => {
                        if (!updatedPermissions.includes(permission.id)) {
                            updatedPermissions.push(permission.id);
                        }
                    });
                    return updatedPermissions;
                });
            }
        }

        if (removedRoles.length > 0) {
            for (const removedRole of removedRoles) {
                const response = await fetchPermissionsForRole(removedRole);
                const permissionsFromRole = response || [];
                const remainingRoles = safeSelectedOptions.filter((role) => role.value !== removedRole);

                const remainingPermissions = [];
                for (const role of remainingRoles) {
                    const roleResponse = await fetchPermissionsForRole(role.value);
                    const rolePermissions = roleResponse || [];
                    remainingPermissions.push(...rolePermissions);
                }

                setSelectedPermissions((prevPermissions) => {
                    return prevPermissions.filter((permissionId) => {
                        return !permissionsFromRole.some((permission) => {
                            return permission.id === permissionId &&
                                !remainingPermissions.some((p) => p.id === permission.id);
                        });
                    });
                });
            }
        }

        setOldSelectedRoles(safeSelectedOptions.map((option) => option.value));
        setSelectedRoles(safeSelectedOptions);
    };

    const handlePermissionChange = (selectedOptions) => {
        setSelectedPermissions(selectedOptions ? selectedOptions.map((option) => option.value) : []);
    };

    const handleSubmit = async () => {
        showLoader();
        try {
            await updateUser(id, formData);
        } catch (error) {
            console.error('Error updating user: ', error);
        } finally {
            hideLoader();
        }
    };

    const handlePermissionSubmit = async () => {
        showLoader();
        try {
            await updateUserPermissions(id, selectedPermissions);
        } catch (error) {
            console.error('Error updating permissions: ', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate('/usuarios');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Usuário
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar Usuário"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        userProfileFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                getOptions={() => []}
                                getSelectedValue={() => null}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>

                <Form
                    onSubmit={handlePermissionSubmit}
                    initialFormData={{ permissions: selectedPermissions }}
                    textSubmit="Atualizar Permissões"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            <div className="form-group">
                                <label htmlFor="roles" className="text-dark font-weight-bold">Cargos:</label>
                                <Select
                                    id="roles"
                                    isMulti
                                    value={selectedRoles}
                                    onChange={handleRoleChange}
                                    options={roles.map((role) => ({ value: role.id, label: role.name }))}
                                    isClearable
                                    noOptionsMessage={() => "Nenhum cargo encontrado"}
                                    placeholder="Selecione os cargos (opcional)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="permissions" className="text-dark font-weight-bold">Permissões:</label>
                                <Select
                                    isMulti
                                    name="permissions"
                                    options={permissions.map((permission) => ({ value: permission.id, label: permission.name }))}
                                    value={permissions
                                        .filter((permission) => selectedPermissions.includes(permission.id))
                                        .map((permission) => ({ value: permission.id, label: permission.name }))}
                                    onChange={handlePermissionChange}
                                    noOptionsMessage={() => "Nenhuma permissão encontrada"}
                                    placeholder="Selecione as permissões"
                                />
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditUserPage;
