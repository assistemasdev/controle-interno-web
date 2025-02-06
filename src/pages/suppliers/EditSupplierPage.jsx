import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { supplierFields } from '../../constants/forms/supplierFields';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';

const EditSupplierPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);

    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(supplierFields));

    const fetchSupplier = useCallback(async () => {
        showLoader();
        try {
            const supplier = await fetchById(entities.suppliers.getByColumn(id));
            formatData(supplier.result, supplierFields);
            setFormData(prev => ({
                ...prev,
                cpf_cnpj: maskCpfCnpj(supplier.result.cpf_cnpj || ''),
            }));
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados do fornecedor.');
        } finally {
            hideLoader();
        }
    }, [id, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchSupplier();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();

        const sanitizedData = {
            ...formData,
            cpf_cnpj: removeMask(formData.cpf_cnpj)
        };
        
        try {
            await update(entities.suppliers.update(id), sanitizedData);
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao atualizar o fornecedor.');
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate('/fornecedores/');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Fornecedor" showBackButton={true} backUrl="/fornecedores/" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() => (
                        <>
                            {supplierFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    formData={formData}
                                    formErrors={formErrors}
                                    handleFieldChange={handleChange}
                                />
                            ))}
                        </>
                    )}
                </Form>
                
            </div>
        </MainLayout>
    );
};

export default EditSupplierPage;
