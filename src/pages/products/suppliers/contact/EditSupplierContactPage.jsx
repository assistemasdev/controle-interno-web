import React, { useEffect } from 'react';
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

const EditSupplierContactPage = () => {
    const navigate = useNavigate();
    const { supplierId, contactId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(contactFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const contact = await fetchById(entities.suppliers.contacts.getByColumn(supplierId, contactId));
                formatData(contact.result, contactFields)
            } catch (error) {
                console.error(error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [supplierId, contactId]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.suppliers.contacts.update(supplierId, contactId), formData);
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${supplierId}/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Contato do Fornecedor" showBackButton={true} backUrl={`/fornecedores/detalhes/${supplierId}/`} /> 

            <div className="container-fluid p-1">
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

export default EditSupplierContactPage;
