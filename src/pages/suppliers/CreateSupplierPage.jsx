import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useSupplierService from '../../hooks/useSupplierService';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { createSupplierFields } from '../../constants/forms/supplierFields';
import { maskCep, removeMask } from '../../utils/maskUtils';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const CreateSupplierPage = () => {
    const navigate = useNavigate(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { createSupplier, formErrors } = useSupplierService(navigate);
    const { formData, setFormData, handleChange, resetForm } = useForm(setDefaultFieldValues(createSupplierFields));

    const handleCepChange = useCallback(async (fieldId, value) => {
        const maskedValue = maskCep(value);
        const zip = removeMask(maskedValue);

        handleChange(fieldId, maskedValue);

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
                        country: 'Brasil',
                    },
                }));
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader();
            }
        }
    }, [handleChange, setFormData, showLoader, hideLoader, showNotification]);

    const handleSubmit = useCallback(async () => {
        showLoader();

        const sanitizedData = {
            supplier: {
                ...formData.supplier,
                cpf_cnpj: removeMask(formData.supplier.cpf_cnpj),
            },
            address: {
                ...formData.address,
                zip: removeMask(formData.address.zip),
            },
            contact: formData.contact,
        };

        try {
            const success = await createSupplier(sanitizedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
        } finally {
            hideLoader();
        }
    }, [formData, createSupplier, resetForm, showLoader, hideLoader]);

    const handleBack = useCallback(() => {
        navigate('/fornecedores/');  
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Fornecedores
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
                            {createSupplierFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    formErrors={formErrors}
                                    handleFieldChange={(fieldId, value) => {
                                        if (fieldId === 'address.zip') {
                                            handleCepChange(fieldId, value);
                                        } else {
                                            handleChange(fieldId, value);
                                        }
                                    }}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateSupplierPage;
