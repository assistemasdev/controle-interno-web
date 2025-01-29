import React, { useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import { osItemTypeFields } from '../../../constants/forms/osItemTypeFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CreateOsItemTypePage = () => {
    const navigate = useNavigate();
    const { post: createOsItemType, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(osItemTypeFields));

    const handleSubmit = async () => {
        try {
            const success = await createOsItemType(entities.orders.itemsTypes.create() ,formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar tipo:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/ordem-servico/tipos-itens');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Tipo de Item de Ordem de Serviço
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osItemTypeFields.map((section) => (
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

export default CreateOsItemTypePage;
