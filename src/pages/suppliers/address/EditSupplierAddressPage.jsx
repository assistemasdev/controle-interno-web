import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import Form from '../../../components/Form';
import { addressFields } from '../../../constants/forms/addressFields';
import FormSection from '../../../components/FormSection';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import PageHeader from '../../../components/PageHeader';

const EditSupplierAddressPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate)
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, formatData, setFormData } = useForm(setDefaultFieldValues(addressFields));

    const handleFieldChange = (fieldId, value) => {
        handleChange(fieldId, value)

        if (fieldId == 'zip') {
            handleCepChange(fieldId, value)
        }
    }
    const handleCepChange = async (id, value) => {    
        const maskedValue = id === 'zip' ? maskCep(value) : value;
        setFormData((prev) => ({
            ...prev,
            [id]: maskedValue
        }));
    
        if (id === 'zip' && removeMask(value).length === 8) {
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
            } catch (error) {
                showNotification('error', error.message);
            } finally {
                hideLoader(); 
            }
        }
    };
    

    useEffect(() => {
        fetchAddress();
    }, [id]);

    const fetchAddress = async () => {
        try {
            showLoader();
            const response = await fetchById(entities.suppliers.addresses.getByColumn(id, addressId));
            const address = response.result;

            formatData(address, addressFields);

            setFormData(prev => ({
                ...prev,
                zip: maskCep(address.zip || ''),
            }));            
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const handleSubmit = async () => {
        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        };

        try {
            await update(entities.suppliers.addresses.update(id, addressId), sanitizedData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Endereço do Fornecedor" showBackButton={true} backUrl={`/fornecedores/detalhes/${id}/`} /> 
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        addressFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                formErrors={formErrors}
                            />
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditSupplierAddressPage;
