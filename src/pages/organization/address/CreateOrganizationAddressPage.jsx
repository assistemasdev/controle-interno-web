import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import { addressFields } from '../../../constants/forms/addressFields';
import FormSection from '../../../components/FormSection';
import Form from '../../../components/Form';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CreateOrganizationAddressPage = () => {
    const navigate = useNavigate();
    const { organizationId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        post: create, 
        formErrors 
    } = useBaseService(navigate);
    const { formData, setFormData, handleChange, resetForm } = useForm(setDefaultFieldValues(addressFields));

    const handleFieldChange = useCallback(async (fieldId, value) => {
        if (fieldId === 'zip') {
            handleCepChange(value);
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange]);

    const handleCepChange = useCallback(async (cep) => {
        const value = maskCep(cep);
        const zip = removeMask(value);

        setFormData((prev) => ({
            ...prev,
            zip: value,
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
                    street: data.logradouro || '',
                    district: data.bairro || '',
                    city: data.localidade || '',
                    state: data.uf || '',
                    country: 'Brasil',
                }));

                showNotification('success', 'Endereço preenchido automaticamente!');
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader();
            }
        }
    }, [setFormData, showNotification, showLoader, hideLoader]);

    const handleSubmit = useCallback(async (data) => {
        showLoader();

        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        };

        try {
            const success = await create(entities.organizations.addresses.create(organizationId), sanitizedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [create, organizationId, navigate, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/detalhes/${organizationId}/`);
    }, [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Endereço da Organização
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

export default CreateOrganizationAddressPage;
