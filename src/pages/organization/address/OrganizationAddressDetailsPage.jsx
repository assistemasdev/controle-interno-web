import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useOrganizationService from '../../../hooks/useOrganizationService';
import { maskCep } from '../../../utils/maskUtils';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { addressFields } from '../../../constants/forms/addressFields';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';

const OrganizationAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { organizationId, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { fetchOrganizationAddressById } = useOrganizationService(navigate);
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(addressFields));
    
    const fetchAddress = useCallback(async () => {
        showLoader();
        try {
            const response = await fetchOrganizationAddressById(organizationId, addressId);
            formatData(response, addressFields)
            setFormData(prev => ({
                ...prev,
                zip: maskCep(response.zip)
            }));
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados do endereço.');
        } finally {
            hideLoader();
        }
    }, [fetchOrganizationAddressById, organizationId, addressId, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchAddress();
    }, [organizationId, addressId]);

    const handleBack = useCallback(() => {
        navigate(`/organizacoes/detalhes/${organizationId}`);
    }, [navigate, organizationId]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Endereço da Organização
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    <DetailsSectionRenderer sections={addressFields} formData={formData} />

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrganizationAddressDetailsPage;
