import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import { maskCep } from '../../../utils/maskUtils';
import useLoader from '../../../hooks/useLoader';
import { addressFields } from '../../../constants/forms/addressFields';
import useForm from '../../../hooks/useForm';
import useNotification from '../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CostumerAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(addressFields));
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { getByColumn: fetchById } = useBaseService(navigate);
    useEffect(() => {
        fetchAddress();
    }, [id]);

    const fetchAddress = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(entities.customers.addresses.getByColumn(id, addressId));
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
    }, [id, addressId, navigate, setFormData, showLoader, hideLoader, showNotification]);

    const handleBack = useCallback(() => {
        navigate(`/clientes/detalhes/${id}`);
    }, [id, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Endereço do Cliente
                </div>

                <DetailsSectionRenderer sections={addressFields} formData={formData} />

                <div className="mt-3 d-flex gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </div>
        </MainLayout>
    );
};

export default CostumerAddressDetailsPage;
