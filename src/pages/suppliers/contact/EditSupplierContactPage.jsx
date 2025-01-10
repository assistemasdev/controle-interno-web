import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { contactFields } from '../../../constants/forms/contactFields';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useSupplierService from '../../../hooks/useSupplierService';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const EditSupplierContactPage = () => {
    const navigate = useNavigate();
    const { supplierId, contactId } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { fetchSupplierContactById, updateSupplierContact, formErrors } = useSupplierService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(contactFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const contact = await fetchSupplierContactById(supplierId, contactId);
                formatData(contact, contactFields)
            } catch (error) {
                console.error(error);
                showNotification('error', 'Erro ao carregar os dados do contato.');
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [supplierId, contactId]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await updateSupplierContact(supplierId, contactId, formData);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao atualizar contato.');
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${supplierId}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Contato do Fornecedor
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Salvar Alterações"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
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

export default EditSupplierContactPage;
