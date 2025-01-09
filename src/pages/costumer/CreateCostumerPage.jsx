import React, { useState, useMemo, useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { customerFields } from '../../constants/forms/customerFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import useCustomerService from '../../hooks/useCustomerService';
import { maskCep, removeMask } from '../../utils/maskUtils';
import useForm from '../../hooks/useForm';

const CreateCustomerPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { createCustomer, formErrors } = useCustomerService(navigate);

    const { formData, handleChange, setFormData, initializeData, resetForm } = useForm({});

    useEffect(() => {
        initializeData(customerFields);
    }, [customerFields]);
    
    const handleCepChange = useCallback(async (e) => {
        const value = maskCep(e.target.value);
        const zip = removeMask(value);

        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                zip: value
            } 
        }));

        if (zip.length === 8) {
            showLoader();
            try {
                const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
                if (!response.ok) throw new Error('Erro ao buscar o CEP');

                const data = await response.json();
                if (data.erro) throw new Error('CEP não encontrado');

                setFormData((prev) => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        street: data.logradouro || '',
                        district: data.bairro || '',
                        city: data.localidade || '',
                        state: data.uf || '',
                        country: 'Brasil'
                    }
                }));
                
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader();
            }
        }
    }, [setFormData, showNotification]);

    const handleFieldChange = useCallback((fieldId, value) => {
        if (fieldId === 'address.zip') {
            handleCepChange({ target: { value } });
        } else {
            handleChange(fieldId, value);
        }
    }, [handleCepChange, handleChange]);

    const handleSubmit = useCallback(async () => {
        showLoader();
         const sanitizedData = {
                    customer: {
                        ...formData.customer
                    },
                    address: {
                        ...formData.address,
                        zip: removeMask(formData.address.zip),
                    },
                    contact: {
                        ...formData.contact
                    }
                };
        try {
            await createCustomer(sanitizedData);
            resetForm();
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao criar cliente.');
        } finally {
            hideLoader();
        }
    }, [createCustomer, formData, showLoader, hideLoader, showNotification, initializeData]);

    const handleBack = useCallback(() => {
        navigate('/clientes/');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Clientes
                </div>

                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    initialFormData={formData}
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {customerFields.map((section) => (
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

export default CreateCustomerPage;
