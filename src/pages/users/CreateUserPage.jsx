import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Form from '../../components/Form';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useUserService from '../../hooks/useUserService';
import useLoader from '../../hooks/useLoader';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { formErrors, createUser } = useUserService(navigate);

    const memoizedInitialData = useMemo(() => ({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    }), []);

    const handleSubmit = async (data) => {
        showLoader();
        try {
            await createUser(data);
        } catch (error) {
            console.error('Error creating user:', error);
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
                    Cadastro de Usuário
                </div>

                <Form
                    initialFormData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Usuário"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        userProfileFields.map((field) => (
                            <div key={field.id}>
                                <h5>{field.section}</h5>
                                <hr />
                                <div className="form-row">
                                    {field.fields.map((item) => (
                                        <div className="d-flex flex-column col-md-6" key={item.id}>
                                            <InputField
                                                label={item.label}
                                                type={item.type}
                                                id={item.id}
                                                value={formData[item.id]}
                                                onChange={handleChange}
                                                placeholder={item.placeholder}
                                                error={formErrors[item.id]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateUserPage;
