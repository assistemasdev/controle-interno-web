import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import useLoader from '../../../../hooks/useLoader';
import useNotification from '../../../../hooks/useNotification';
import useForm from '../../../../hooks/useForm';
import useBaseService from '../../../../hooks/services/useBaseService';
import { locationFields } from '../../../../constants/forms/locationFields';
import Form from '../../../../components/Form';
import FormSection from '../../../../components/FormSection';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const EditCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId, locationId } = useParams(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(locationFields));
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);

    const fetchLocationData = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(entities.customers.addresses.locations(id).getByColumn(addressId, locationId));
            formatData(response.result, locationFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, locationId, setFormData, showLoader, hideLoader, fetchById, showNotification]);

    useEffect(() => {
        fetchLocationData();
    }, [id, addressId, locationId]);

    const handleSubmit = useCallback(async () => {
        try {
            await update(entities.customers.addresses.locations(id).update(addressId, locationId), formData);
        } catch (error) {
            console.error(error);
        }
    }, [id, addressId, locationId, formData, update, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    }, [id, addressId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Editar Localização" showBackButton={true} backUrl={`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`} />

            <div className="container-fluid p-1">
                <Form
                    handleBack={handleBack}
                    onSubmit={handleSubmit}
                    textSubmit='Editar'
                    textLoadingSubmit='Editando'
                    initialFormData={formData}
                >
                    {() => (
                        <>
                            {locationFields.map((section) => (
                                <FormSection
                                    key={section.section}
                                    section={section}
                                    handleFieldChange={handleChange}
                                    formData={formData}
                                    formErrors={formErrors}
                                />
                            ))}
                        </>
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditCustomerLocationPage;
