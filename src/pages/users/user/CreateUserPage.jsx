import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import { userProfileFields } from '../../../constants/forms/userProfileFields';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader'; 
import SimpleForm from '../../../components/forms/SimpleForm';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(userProfileFields));
    const { formErrors, post:create } = useBaseService(navigate);
    
    const handleSubmit = async () => {
        showLoader();
        try {
            const success = await create(entities.users.create, formData);
            if (success) {
                resetForm();
            }
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
            <PageHeader title="Cadastro de Usuário" showBackButton={true} backUrl="/usuarios"/>
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar Usuário"
                    initialFormData={formData}
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        userProfileFields.map((section) => (
                            <SimpleForm
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
