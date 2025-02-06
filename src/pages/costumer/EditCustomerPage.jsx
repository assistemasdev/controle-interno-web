import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import PageHeader from '../../components/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { editCustomerFields } from '../../constants/forms/customerFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';

const EditCustomerPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(editCustomerFields));

    useEffect(() => {
        const fetchCustomerData = async () => {
            showLoader();
            try {
                const response = await fetchById(entities.customers.getByColumn(id));
                formatData(response.result, editCustomerFields);
                setFormData(prev => ({
                    ...prev,
                    cpf_cnpj: maskCpfCnpj(response.result.cpf_cnpj)
                }));
            } catch (error) {
                console.log(error);
            } finally {
                hideLoader();
            }
        };

        fetchCustomerData();
    }, [id]);

    const handleFieldChange = useCallback((fieldId, value) => {
        if (fieldId === 'customer.cpf_cnpj') {
            handleChange(fieldId, maskCpfCnpj(value));
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange]);

    const handleSubmit = useCallback(async () => {
        showLoader();
        const sanitizedData = {
            ...formData,
            cpf_cnpj: removeMask(formData.cpf_cnpj), 
        };

        try {
            await update(entities.customers.update(id), sanitizedData);
        } catch (error) {
            console.log(error);
        } finally {
            hideLoader();
        }
    }, [formData, update, id, showLoader, hideLoader]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Cliente" showBackButton={true} backUrl="/clientes/" />
            <div className="container-fluid p-1">

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    initialFormData={formData}
                    textLoadingSubmit="Atualizando..."
                >
                    {() => (
                        <>
                            {editCustomerFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    formErrors={formErrors}
                                    handleFieldChange={handleFieldChange}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditCustomerPage;
