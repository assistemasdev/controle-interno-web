import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import Form from '../../../../components/Form';
import FormSection from '../../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useForm from '../../../../hooks/useForm';
import { editOrderServiceFields } from '../../../../constants/forms/orderServiceFields';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';

const EditContractOsPage = () => {
    const { id, contractOsId } = useParams();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { 
        getByColumn: fetchByContractOsById,
        get: fetchOsStatus,
        get: fetchOsDepartaments,
        get: fetchOsDestinations,
        put: update, 
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { formData, handleChange, resetForm, formatData, setFormData } = useForm(setDefaultFieldValues(editOrderServiceFields));
    const [oSstatus, setOsStatus] = useState([]);
    const [osDepartaments, setOsDepartaments] = useState([]);
    const [osDestinations, setOsDestinations] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            showLoader()
            const [
                contractOsResponse,
                osStatusResponse,
                osDepartamentsResponse,
                osDestinationsResponse,
            ] = await Promise.all([
                fetchByContractOsById(entities.contracts.orders.getByColumn(id, contractOsId)),
                fetchOsStatus(entities.orders.status.get()),
                fetchOsDepartaments(entities.orders.departaments.get()),
                fetchOsDestinations(entities.orders.destinations.get()),
            ])
    
            formatData(contractOsResponse.result, editOrderServiceFields)
            setFormData((prev) => ({
                ...prev,
                deadline: contractOsResponse.result.deadline.split(" ")[0]
            }));

            setOsStatus(osStatusResponse.result.data.map((status) => ({
                label: status.name,
                value: status.id
            })));
    
            setOsDepartaments(osDepartamentsResponse.result.data.map((departament) => ({
                label: departament.name,
                value: departament.id
            })))
    
            setOsDestinations(osDestinationsResponse.result.data.map((destination) => ({
                label: destination.name,
                value: destination.id
            })));
        } catch (error) {
            console.log(error)
            showNotification('error', 'error ao carregar os dados')
        } finally {
            hideLoader()
        }
    }
    
    const getOptions = (fieldId) => {
        switch (fieldId) {
            case "status_id":
                return oSstatus || [];
            case "departament_id":
                return osDepartaments || [];
            case "destination_id":
                return osDestinations || [];
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

    const handleSubmit = async () => {
        try {
            await update(entities.contracts.orders.update(id, contractOsId) ,formData);
        } catch (error) {
            console.error('Erro ao editar os:', error);
        }
    };

    const handleBack = useCallback(() => {
        navigate(`/contratos/${id}/ordens-servicos/`);
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Ordem de Serviço
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                >
                    {() =>
                        editOrderServiceFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                                setFormErrors={setFormErrors}
                                getOptions={getOptions}
                                getSelectedValue={getSelectedValue}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditContractOsPage;
