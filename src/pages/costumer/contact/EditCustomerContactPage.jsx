import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { contactFields } from '../../../constants/forms/contactFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useCustomerService from '../../../hooks/services//useCustomerService';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useContactService from '../../../hooks/services/useContactService';
import { entities } from '../../../constants/entities';

const EditCustomerContactPage = () => {
    const navigate = useNavigate();
    const { id, contactId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(contactFields));
    const { fetchById, update, formErrors } = useContactService(entities.customers, id, navigate);

    useEffect(() => {
        fetchContact();
    }, [id, contactId]);

    const fetchContact = async () => {
        try {
            showLoader();
            const response = await fetchById(contactId);
            formatData(response.result, contactFields)
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await update(contactId, formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Contato do Cliente
                </div>

                <Form 
                    handleBack={handleBack}
                    onSubmit={handleSubmit}
                    textSubmit='Cadastrar'
                    textLoadingSubmit='Cadastrando...'
                    initialFormData={formData}
                >
                    {() => (
                        <>
                            {contactFields.map((section) => (
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

export default EditCustomerContactPage;
