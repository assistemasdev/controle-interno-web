import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { locationFields } from '../../../constants/forms/locationFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { entities } from '../../../constants/entities';

const DetailsCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId, locationId } = useParams(); 
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData } = useForm(setDefaultFieldValues(locationFields));
    const { getByColumn: fetchById } = useBaseService(navigate);

    useEffect(() => {
        fetchLocationData();
    }, [id, addressId]);

    const fetchLocationData = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchById(entities.customers.addresses.locations(id).getByColumn(addressId, locationId));
            setFormData(response.result);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados da localização');
            console.error(error);
        } finally {
            hideLoader();
        }
    }, [id, addressId, locationId, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    }, [id, addressId, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes da Localização
                </div>

                <DetailsSectionRenderer
                    formData={formData}
                    sections={locationFields}
                />

                <div className="mt-3 d-flex gap-2">
                    <Button
                        type="button"
                        text="Voltar"
                        className="btn btn-blue-light fw-semibold"
                        onClick={handleBack}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsCustomerLocationPage;
