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
import useCustomerService from '../../../hooks/useCustomerService';

const EditCustomerContactPage = () => {
    const navigate = useNavigate();
    const { id, contactId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData, handleChange, initializeData } = useForm({});
    const { fetchCustomerContact, updateContact, formErrors } = useCustomerService(navigate);

    useEffect(() => {
        initializeData(contactFields)
        fetchContact();
    }, [id, contactId, contactFields]);

    const fetchContact = async () => {
        try {
            showLoader();
            const contact = await fetchCustomerContact(id, contactId);

            setFormData({
                name: contact.name || '',
                surname: contact.surname || '',
                role: contact.role || '',
                ddd: contact.ddd || '',
                phone: contact.phone || '',
                cell_ddd: contact.cell_ddd || '',
                cell: contact.cell || '',
                email: contact.email || ''
            });
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados do contato');
            console.error(error);
        } finally {
            hideLoader(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await updateContact(id, contactId, formData);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao atualizar contato');
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
