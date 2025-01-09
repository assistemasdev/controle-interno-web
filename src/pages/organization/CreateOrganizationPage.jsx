import React, { useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import { maskCep, removeMask } from '../../utils/maskUtils';
import { organizationFields } from '../../constants/forms/organizationFields';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import colorToHex from '../../utils/colorToHex';
import useOrganizationService from '../../hooks/useOrganizationService';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const CreateOrganizationPage = () => {
    const navigate = useNavigate();
    const { applicationId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(organizationFields));
    const { createOrganization, formErrors } = useOrganizationService(navigate);

    const handleFieldChange = useCallback((fieldId, value, field) => {
        if (fieldId === 'address.zip') {
            handleCepChange(value);
        } else if (fieldId === 'organization.color') {
            handleColorChange(value)
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange]);

    const handleColorChange = (useCallback ((value) => {
        const hexColor = colorToHex(value);
        setFormData((prev) => ({ ...prev, organization: {
            ...prev.organization,
            color: hexColor
        } }));
    }, [setFormData]))

    const handleCepChange = useCallback(async (cep) => {
        const value = maskCep(cep);
        const zip = removeMask(value);

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                zip: value
            }
        }));

        if (zip.length === 8) {
            showLoader()
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

    const handleSubmit = useCallback(async () => {
        const sanitizedData = {
            organization: {
                ...formData.organization
            },
            address: {
                ...formData.address,
                zip: removeMask(formData.address.zip),
            },
            contact: {
                ...formData.contact
            }
        };

        showLoader();
        try {
            const success = await createOrganization(sanitizedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.log(error)
            showNotification('error', 'Erro ao realizar o cadastro.');
        } finally {
            hideLoader();
        }
    }, [formData, showLoader, hideLoader, showNotification, navigate, applicationId]);

    const handleBack = useCallback(() => {
        navigate(`/orgaos/${applicationId}`);
    }, [navigate, applicationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Organizações
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Cadastrar"
                    textLoadingSubmit="Cadastrando..."
                    handleBack={handleBack}
                >
                    {() => (
                        organizationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                                getOptions={() => []}
                                getSelectedValue={() => null}
                            />
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default CreateOrganizationPage;
