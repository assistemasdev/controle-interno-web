import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import Form from '../../../../components/Form';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import { addressFields } from '../../../../constants/forms/addressFields';
import useForm from '../../../../hooks/useForm';
import { maskCep, removeMask } from '../../../../utils/maskUtils';
import { setDefaultFieldValues } from '../../../../utils/objectUtils'
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';
import SimpleForm from '../../../../components/forms/SimpleForm';

const CreateSupplierAddressPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { post: create, formErrors } = useBaseService(navigate);
    const { formData, handleChange, setFormData, resetForm } = useForm(setDefaultFieldValues(addressFields));
    
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
                console.log(error)
            } finally {
                hideLoader();
            }
        }
    }, [setFormData, showNotification, showLoader, hideLoader]);

    const handleFieldChange = useCallback((fieldId, value) => {
        if (fieldId === 'zip') {
            handleCepChange(value);
        } else {
            handleChange(fieldId, value);
        }
    }, [handleChange, handleCepChange]);

    const handleSubmit = useCallback(async () => {
        showLoader();
    
        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip),
        };
    
        try {
            const success = await create(entities.suppliers.addresses.create(id), sanitizedData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader(); 
        }
    }, [formData, id, create, showLoader, hideLoader, showNotification, resetForm]);

    const handleBack = useCallback(() => {
        navigate(`/fornecedores/detalhes/${id}`);
    }, [navigate, id]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Cadastro de Endereço do Fornecedor" showBackButton={true} backUrl={`/fornecedores/detalhes/${id}/`} /> 

            <div className="container-fluid p-1">
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

export default CreateSupplierAddressPage;
