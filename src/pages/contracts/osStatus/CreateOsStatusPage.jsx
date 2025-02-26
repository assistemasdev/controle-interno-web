import React, { useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import { osStatusFields } from '../../../constants/forms/osStatusFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SimpleForm from '../../../components/forms/SimpleForm';

const CreateOsStatusPage = () => {
    const navigate = useNavigate();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(osStatusFields));

    const handleSubmit = async () => {
        try {
            const success = await create(entities.orders.status.create() ,formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar status:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/ordem-servico/status');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Status de Ordem de Serviço" showBackButton={true} backUrl="/contratos/ordem-servico/status/" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osStatusFields.map((section) => (
                            <SimpleForm
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateOsStatusPage;
