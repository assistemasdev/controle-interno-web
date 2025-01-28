import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import Select from 'react-select';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import { removeEmptyValues } from '../../utils/objectUtils';

const EditUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { 
        get: fetchRoles,
        get: fetchPermissions, 
        get: fetchPermissionsForUser, 
        get: fetchPermissionsForRole,
        put: updateUserPermissions, 
        getByColumn: fetchById, 
        put: update, 
        formErrors 
    } = useBaseService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(userProfileFields));
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [oldSelectedRoles, setOldSelectedRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const user = await fetchById(entities.users.getByColumn(id));
            formatData(user.result, userProfileFields);

            const [roles, permissionsData, userPermissions] = await Promise.all([
                fetchRoles(entities.roles.get),
                fetchPermissions(entities.permissions.get),
                fetchPermissionsForUser(entities.users.permissions.getByColumn(id)),
            ]);
            setPermissions(permissionsData.result.data)
            setRoles(roles.result.data)
            setSelectedPermissions(userPermissions.result.map((p) => p.id) || []);

            const userRoles = user.roles || [];
            setSelectedRoles(userRoles.map((r) => ({ value: r.id, label: r.name })));
            setOldSelectedRoles(userRoles.map((r) => r.id));
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            hideLoader();
        }
    }, [id, fetchById, fetchRoles, fetchPermissions, fetchPermissionsForUser, formatData, showLoader, hideLoader]);

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
                const response = await fetchPermissionsForRole(entities.roles.permissions.getByColumn(addedRole.value));
                console.log(response)
                const permissionsFromRole = response.result || [];

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
                const response = await fetchPermissionsForRole(entities.roles.permissions.getByColumn(removedRole));
                const permissionsFromRole = response.result || [];
                const remainingRoles = safeSelectedOptions.filter((role) => role.value !== removedRole);

                const remainingPermissions = [];
                for (const role of remainingRoles) {
                    const roleResponse = await fetchPermissionsForRole(entities.roles.permissions.getByColumn(role.value));
                    const rolePermissions = roleResponse.result || [];
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
            const formatData = removeEmptyValues(formData);
            await update(entities.users.update(id), formatData);
        } catch (error) {
            console.error('Error updating user: ', error);
        } finally {
            hideLoader();
        }
    };

    const handlePermissionSubmit = async () => {
        showLoader();
        try {
            await updateUserPermissions(entities.users.permissions.update(id), {permissions: selectedPermissions});
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
                    initialFormData={formData}
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
