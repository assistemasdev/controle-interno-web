import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import '../../assets/styles/custom-styles.css';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useSupplierService from '../../hooks/useSupplierService';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { supplierFields } from '../../constants/forms/supplierFields';
import { maskCpfCnpj, removeMask } from '../../utils/maskUtils';

const EditSupplierPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchSupplierById, updateSupplier, formErrors } = useSupplierService(navigate);

    const { formData, setFormData, handleChange, initializeData } = useForm({});

    const fetchSupplier = useCallback(async () => {
        showLoader();
        try {
            const supplier = await fetchSupplierById(id);
            initializeData(supplierFields);
            setFormData({
                name: supplier.name || '',
                alias: supplier.alias || '',
                cpf_cnpj: maskCpfCnpj(supplier.cpf_cnpj || ''),
            });
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados do fornecedor.');
        } finally {
            hideLoader();
        }
    }, [id, fetchSupplierById, initializeData, setFormData, showLoader, hideLoader, showNotification]);

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
            await updateSupplier(id, sanitizedData);
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
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Fornecedor
                </div>

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
