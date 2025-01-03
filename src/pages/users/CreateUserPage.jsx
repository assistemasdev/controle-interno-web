import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
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

    const [formData, setFormData] = useState(memoizedInitialData);

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

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
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Usuário"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        userProfileFields.map((field) => (
                            <FormSection
                                key={field.section}
                                section={field}
                                formData={formData}
                                handleFieldChange={handleChange}
                                getOptions={() => []}
                                getSelectedValue={() => null}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateUserPage;
