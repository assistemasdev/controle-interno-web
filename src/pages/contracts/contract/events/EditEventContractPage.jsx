import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import Form from '../../../../components/Form';
import FormSection from '../../../../components/FormSection';
import { editEventFields } from "../../../../constants/forms/eventFields";
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import { useNavigate, useParams } from 'react-router-dom';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useContractService from '../../../../hooks/services/useContractService';

const EditEventContractPage = () => {
    const navigate = useNavigate();
    const { id, eventId } = useParams();
    const { showNotification } = useNotification();
    const { fetchAll: fetchEventTypes } = useBaseService(entities.contractEventTypes, navigate);
    const { fetchAll: fetchContracts } = useBaseService(entities.contracts, navigate);
    const { fetchContractEventById, updateContractEvent, formErrors } = useContractService(navigate)
    const { showLoader, hideLoader } = useLoader();
    const {
        formData,
        setFormData,
        handleChange,
        initializeData,
        formatData
    } = useForm(setDefaultFieldValues(editEventFields));
    const [eventTypes, setEventTypes] = useState([]);
    const [contracts, setContracts] = useState([]);
    
    useEffect(() => {
        initializeData(editEventFields);

        const fetchData = async () => {
            showLoader();
            try {
                const [
                    contractEventResponse,
                    contractEventTypesResponse,
                    contractsResponse
                ] = await Promise.all([
                    fetchContractEventById(id, eventId),
                    fetchEventTypes(),
                    fetchContracts()
                ]);

                formatData(contractEventResponse.result, editEventFields);
                setEventTypes(contractEventTypesResponse.result.data.map((item) => ({
                    value: item.id,
                    label: item.name
                })));
                setContracts(contractsResponse.result.data.map((item) => ({
                    value: item.id,
                    label: item.number
                })));
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
            await updateContractEvent(id, eventId, formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const getOptions = (fieldId) => {
        switch (fieldId) {
            case 'contract_event_type_id':
                return eventTypes;
            case 'contract_id':
                return contracts;
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

    const handleFieldChange = useCallback((fieldId, value, field) => {
        handleChange(fieldId, value);
    
    }, [getOptions]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <p className="text-xs font-weight-bold text-uppercase mb-1">
                    Editar Contrato
                </p>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Salvar"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
                >
                    {() =>
                        editEventFields.map(section => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                getOptions={getOptions}
                                formErrors={formErrors}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditEventContractPage;
