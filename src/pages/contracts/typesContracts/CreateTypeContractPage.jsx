import React, { useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import { typeContractsFields } from '../../../constants/forms/typeContractsFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CreateTypeContractPage = () => {
    const navigate = useNavigate();
    const { create, formErrors } = useBaseService(entities.contractTypes, navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(typeContractsFields));

    const handleSubmit = async () => {
        try {
            const success = await create(formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar tipo:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/tipos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Tipo de Contrato
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        typeContractsFields.map((section) => (
                            <FormSection
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

export default CreateTypeContractPage;
