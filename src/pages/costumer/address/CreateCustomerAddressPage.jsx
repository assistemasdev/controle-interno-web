import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import { usePermissions } from '../../../hooks/usePermissions';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { addressFields } from '../../../constants/forms/addressFields';
import useCustomerService from '../../../hooks/useCustomerService';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const CreateCustomerAddressPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData, resetForm, handleChange } = useForm(setDefaultFieldValues(addressFields));
    const { createAddress, formErrors } = useCustomerService(navigate);

    const handleFieldChange = (fieldId, value) => {
        if (fieldId == 'zip') {
            handleCepChange(value);
        } else {
            handleChange(fieldId, value);
        }
    }

    const handleCepChange = async (value) => {

        const maskedValue = maskCep(value);

        setFormData((prev) => ({
            ...prev,
            zip: maskedValue
        }));

        if (value && removeMask(value).length === 8) {
            showLoader();
            try {
                const response = await fetch(`https://viacep.com.br/ws/${removeMask(value)}/json/`);
                if (!response.ok) throw new Error('Erro ao buscar o CEP');
                
                const data = await response.json();
                if (data.erro) throw new Error('CEP não encontrado');

                setFormData((prev) => ({
                    ...prev,
                    street: data.logradouro || '',
                    district: data.bairro || '',
                    city: data.localidade || '',
                    state: data.uf || '',
                    country: 'Brasil'
                }));
                showNotification('success', 'Endereço preenchido automaticamente!');
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader();
            }
        }
    };

    const handleSubmit = async () => {
        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        }

        try {
            await createAddress(id, sanitizedData);
            resetForm();
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao criar endereço');
        }
    };

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Endereço do Cliente
                </div>

                <Form
                    initialFormData={formData}
                    handleBack={handleBack}
                    textSubmit='Cadastrar'
                    textLoadingSubmit='Cadastrando...'
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <>
                            {addressFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    handleFieldChange={handleFieldChange}
                                    formErrors={formErrors}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateCustomerAddressPage;
