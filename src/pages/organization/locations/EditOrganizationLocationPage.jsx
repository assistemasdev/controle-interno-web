import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import useBaseService from '../../../hooks/services/useBaseService';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { locationFields } from '../../../constants/forms/locationFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const EditOrganizationLocationPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId, locationId } = useParams(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);

    const { formData, setFormData, handleChange, formatData } = useForm(setDefaultFieldValues(locationFields));

    const fetchLocationData = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.organizations.addresses.locations(organizationId).getByColumn(addressId, locationId));
            formatData(response.result, locationFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização');
        } finally {
            hideLoader();
        }
    }, [fetchById, organizationId, addressId, locationId, showLoader, hideLoader, showNotification, setFormData]);

    useEffect(() => {
        fetchLocationData();
    }, [organizationId, addressId, locationId]);

    const handleSubmit = async (data) => {
        showLoader();

        try {
            await update(entities.organizations.addresses.locations(organizationId).update(addressId, locationId), data);
        } catch (error) {
            console.log(error);
            showNotification('error', 'Erro ao atualizar localização');
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate(`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <PageHeader 
                    title="Editar Localização" 
                    showBackButton={true} 
                    backUrl={`/organizacoes/detalhes/${organizationId}/enderecos/${addressId}/localizacoes`} 
                />

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Salvar"
                    textLoadingSubmit="Salvando..."
                    handleBack={handleBack}
                >
                    {() => (
                        locationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                formErrors={formErrors}
                                handleFieldChange={handleChange}
                            />
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditOrganizationLocationPage;
