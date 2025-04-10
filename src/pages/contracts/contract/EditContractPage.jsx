import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import { contractEditFields } from "../../../constants/forms/contractFields";
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { setDefaultFieldValues, transformObjectValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SectionHeader from '../../../components/forms/SectionHeader';
import SimpleBody from '../../../components/forms/SimpleBody';

const EditContractPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchById,
        put: update, 
        formErrors 
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const {
        formData,
        handleChange,
        initializeData,
        formatData,
        setFormData
    } = useForm(setDefaultFieldValues(contractEditFields));


    useEffect(() => {
        initializeData(contractEditFields);

        const fetchData = async () => {
            showLoader();
            try {
                const [
                    contractResponse,
                ] = await Promise.all([
                    fetchById(entities.contracts.getByColumn(id))
                ]);
                formatData(contractResponse.result, contractEditFields)
                setFormData((prev) => ({
                    ...prev,
                    conctract_type_id: {value: contractResponse.result.id, label: contractResponse.result.contract_type},
                    contract_status_id: {value: contractResponse.result.contract_status_id, label: contractResponse.result.contract_status},
                    contract_type_id: {value: contractResponse.result.contract_type_id, label: contractResponse.result.contract_type},
                    organization_id: {value: contractResponse.result.organization_id, label: contractResponse.result.organization_name},
                    customer_id: {value: contractResponse.result.customer_id, label: contractResponse.result.customer_name},

                }))
            } catch (error) {
                console.error(error);
                showNotification('error', 'Erro ao carregar dados do contrato.');
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            showLoader();
            const data = transformObjectValues(formData);
            await update(entities.contracts.update(id), data);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const getOptions = (fieldId) => {
        switch (fieldId) {
            default:
                return [];
        }
    };

    const getSelectedValue = (fieldId) => {
        if (fieldId) {
            const value = formData[fieldId];
            return getOptions(fieldId).find((option) => option.value === value) || null;
        }
        return null;
    };

    const handleBack = () => {
        navigate(`/contratos/`);  
    };


    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Contrato" showBackButton={true} backUrl="/contratos" />
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Salvar"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
                >
                    {() =>
                        contractEditFields.map((section) => (
                            <>
                                <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={false}
                                    setViewTable={() => {}}
                                    addFieldsInData={() => {}}
                                />

                                <SimpleBody
                                    fields={section.fields}
                                    formErrors={formErrors}
                                    formData={formData}
                                    handleFieldChange={handleChange}
                                    getOptions={getOptions}
                                    getSelectedValue={getSelectedValue}
                                />
                            </>
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditContractPage;
