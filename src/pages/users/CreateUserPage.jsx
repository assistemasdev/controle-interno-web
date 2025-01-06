import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useUserService from '../../hooks/useUserService';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { formErrors, createUser } = useUserService(navigate);

    const { formData, handleChange, resetForm, initializeData } = useForm({});

    useEffect(() => {
        initializeData(userProfileFields);
    }, [userProfileFields]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await createUser(formData);
            resetForm();
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
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
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Usuário"
                    textLoadingSubmit="Cadastrando..."
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
            </div>
        </MainLayout>
    );
};

export default CreateUserPage;
