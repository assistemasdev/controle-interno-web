import React, { useEffect } from 'react';
import MainLayout from '../../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../../assets/styles/custom-styles.css';
import useNotification from '../../../../hooks/useNotification';
import useLoader from '../../../../hooks/useLoader';
import useForm from '../../../../hooks/useForm';
import Form from '../../../../components/Form'; 
import FormSection from '../../../../components/FormSection';
import { editMovementsFields } from "../../../../constants/forms/shipmentFields";
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const EditMovementsShipmentsPage = () => {
    const { id, shipmentId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { 
        put: update, 
        getByColumn: fetchById,
        formErrors,
        setFormErrors
    } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, resetForm, setFormData, formatData } = useForm(setDefaultFieldValues(editMovementsFields));
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();
                const response = await fetchById(entities.movements.shipments.getByColumn(id,shipmentId))
                formatData(response.result, editMovementsFields);
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao carregar os dados.';
                showNotification('error', errorMessage);
                console.error('Erro no carregamento dos dados:', error);
            } finally {
                hideLoader();
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        showLoader();
        try {
            const success = await update(entities.movements.shipments.update(id, shipmentId), formData);
            if (success) {
                resetForm();
            }
        } catch (error) {
            console.error('Error creating movement:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/movimentos/${id}/carregamentos`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Carregamento do Movimento" showBackButton={true} backUrl={`/movimentos/${id}/carregamentos`}/>
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Editar"
                    textLoadingSubmit="Editando..."
                    handleBack={handleBack}
                >
                    {() => 
                        editMovementsFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                                setFormData={setFormData}
                                setFormErrors={setFormErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditMovementsShipmentsPage;
