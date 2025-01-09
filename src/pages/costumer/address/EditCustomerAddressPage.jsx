import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useCustomerService from '../../../hooks/useCustomerService';
import useForm from '../../../hooks/useForm';
import { addressFields } from '../../../constants/forms/addressFields';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';

const EditCustomerAddressPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchCustomerAddress, updateAddress, formErrors } = useCustomerService(navigate);
    const { formData, setFormData, initializeData, handleChange } = useForm({});

    const handleFieldChange = useCallback((fieldId, value) => {
        if (fieldId === 'zip') {
            handleCepChange(value);
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange]);

    const handleCepChange = useCallback(async (value) => {
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
    }, [setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        initializeData(addressFields);
        fetchAddress();
    }, [id, addressId, addressFields]);

    const fetchAddress = useCallback(async () => {
        try {
            showLoader();
            const address = await fetchCustomerAddress(id, addressId);

            setFormData({
                alias: address.alias || '',
                zip: maskCep(address.zip || ''),
                street: address.street || '',
                number: address.number || '',
                details: address.details || '',
                district: address.district || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || ''
            });
        } catch (error) {
            showNotification('error', 'Erro ao buscar pelo endereço');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [fetchCustomerAddress, id, addressId, setFormData, showLoader, hideLoader, showNotification]);

    const handleSubmit = useCallback(async () => {
        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        };

        try {
            await updateAddress(id, addressId, sanitizedData);
        } catch (error) {
            console.error(error);
            showNotification('error', 'Erro ao editar o endereço');
        }
    }, [formData, id, addressId, updateAddress, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}`);
    }, [id, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Endereço do Cliente
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {addressFields.map((section) => (
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

export default EditCustomerAddressPage;
