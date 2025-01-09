import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { editCustomerFields  } from '../../constants/forms/customerFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useCustomerService from '../../hooks/useCustomerService';
import useForm from '../../hooks/useForm';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';

const EditCustomerPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { fetchCustomerById, updateCustomer, formErrors } = useCustomerService(navigate);

    const { formData, setFormData, handleChange, initializeData } = useForm({});

    useEffect(() => {
        const fetchCustomerData = async () => {
            showLoader();
            try {
                const response = await fetchCustomerById(id);
                initializeData(editCustomerFields);
                setFormData({
                    alias: response.alias,
                    name: response.name,
                    cpf_cnpj: maskCpfCnpj(response.cpf_cnpj)
                });

            } catch (error) {
                console.log(error)
                showNotification('error', error.message || 'Erro ao buscar cliente.');
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
            await updateCustomer(id, sanitizedData);
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao atualizar cliente.');
        } finally {
            hideLoader();
        }
    }, [formData, updateCustomer, id, navigate, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate('/clientes/');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Editar Cliente
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    initialFormData={formData}
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
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
