import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { locationFields } from '../../../constants/forms/locationFields';
import useBaseService from '../../../hooks/services/useBaseService';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';

const CreateOrganizationLocationPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId } = useParams(); 
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, resetForm, handleChange } = useForm(setDefaultFieldValues(locationFields));

    const handleSubmit = async (data) => {
        try {
            const success = await create(entities.organizations.addresses.locations(organizationId, addressId).create(), data);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao cadastrar localização:', error);
        }
    };

    const handleBack = () => {
        navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Localização
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {locationFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    formErrors={formErrors}
                                    handleFieldChange={handleChange}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateOrganizationLocationPage;
