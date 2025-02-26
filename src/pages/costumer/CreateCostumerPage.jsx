import React, { useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { customerFields } from '../../constants/forms/customerFields';
import useNotification from '../../hooks/useNotification';
import useLoader from '../../hooks/useLoader';
import { maskCep, removeMask } from '../../utils/maskUtils';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import SimpleForm from '../../components/forms/SimpleForm';
const CreateCustomerPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, setFormData, initializeData, resetForm } = useForm(setDefaultFieldValues(customerFields));

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

                showNotification('success', 'Endereço preenchido automaticamente!');
                
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
            const success = await create(entities.customers.create, sanitizedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao criar cliente.');
        } finally {
            hideLoader();
        }
    }, [create, formData, showLoader, hideLoader, showNotification, initializeData]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Clientes" showBackButton={true} backUrl="/clientes/" />
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Cadastrar"
                    initialFormData={formData}
                    textLoadingSubmit="Cadastrando..."
                >
                    {() => (
                        <>
                            {customerFields.map((section) => (
                                <SimpleForm
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
