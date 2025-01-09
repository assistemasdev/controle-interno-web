import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import CustomerService from '../../../services/CustomerService';
import { maskCep } from '../../../utils/maskUtils';
import useLoader from '../../../hooks/useLoader';
import { addressFields } from '../../../constants/forms/addressFields';
import useForm from '../../../hooks/useForm';
import useNotification from '../../../hooks/useNotification';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const CostumerAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { formData, setFormData } = useForm(setDefaultFieldValues(addressFields));
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchAddress();
    }, [id]);

    const fetchAddress = useCallback(async () => {
        try {
            showLoader();
            const response = await CustomerService.showCustomerAddress(id, addressId, navigate);
            const address = response.result;

            setFormData({
                alias: address.alias || '',
                zip: maskCep(address.zip || ''),
                street: address.street || '',
                number: address.number || '',
                details: address.details || '',
                district: address.district || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || ''
            });
        } catch (error) {
            showNotification('error', 'Erro ao buscar pelo endereço');
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
