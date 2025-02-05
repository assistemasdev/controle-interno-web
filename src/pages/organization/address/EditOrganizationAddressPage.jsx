import React, { useEffect, useCallback } from 'react';
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
import PageHeader from '../../../components/PageHeader';  

const EditOrganizationAddressPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchById, 
        put: update, 
        formErrors 
    } = useBaseService(navigate);
    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(addressFields));
    
    const handleFieldChange = useCallback((fieldId, value, field) => {
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
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader();
            }
        }
    }, [setFormData, showNotification]);

    const fetchData = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.organizations.addresses.getByColumn(organizationId,addressId));
        
            formatData(response.result, addressFields)
            setFormData(prev => ({
                ...prev,
                zip: maskCep(response.result.zip)
            }))
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao carregar os dados do endereço.');
        } finally {
            hideLoader();
        }
    }, [fetchById, organizationId, addressId, showLoader, hideLoader, navigate, showNotification, setFormData]);

    const handleSubmit = useCallback(async (data) => {
        showLoader();

        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        };

        try {
            await update(entities.organizations.addresses.update(organizationId, addressId), sanitizedData);
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao atualizar o endereço.');
        } finally {
            hideLoader();
        }
    }, [update, organizationId, addressId, navigate , showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchData();
    }, [organizationId, addressId]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/detalhes/${organizationId}`);
    }, [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <PageHeader 
                    title="Edição de Endereço da Organização" 
                    showBackButton={true} 
                    backUrl={`/organizacoes/detalhes/${organizationId}/`}  
                />

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar Endereço"
                    textLoadingSubmit="Atualizando..."
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

export default EditOrganizationAddressPage;
