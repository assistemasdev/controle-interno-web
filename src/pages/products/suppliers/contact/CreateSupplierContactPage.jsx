import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import Form from '../../../../components/Form';
import { contactFields } from '../../../../constants/forms/contactFields';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import SimpleForm from '../../../../components/forms/SimpleForm';

const CreateSupplierContactPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, resetForm } = useForm(setDefaultFieldValues(contactFields));

    const handleSubmit = async () => {
        showLoader();
        try {
            const success = await create(entities.suppliers.contacts.create(id), formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Contato do Fornecedor" showBackButton={true} backUrl={`/fornecedores/detalhes/${id}/`} /> 

            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {contactFields.map((section) => (
                                <SimpleForm
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

export default CreateSupplierContactPage;
