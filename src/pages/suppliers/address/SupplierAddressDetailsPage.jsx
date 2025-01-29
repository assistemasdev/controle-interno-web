import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import '../../../assets/styles/custom-styles.css';
import Button from '../../../components/Button';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { addressFields } from '../../../constants/forms/addressFields';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import { maskCep } from '../../../utils/maskUtils';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const SupplierAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(addressFields))
    const { getByColumn: fetchById } = useBaseService(navigate);

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const response = await fetchById(entities.suppliers.addresses.getByColumn(id, addressId));
                formatData(response.result, addressFields);
                setFormData(prev => ({
                    ...prev,
                    zip: maskCep(response.result.zip || ''),
                }));
            } catch (error) {
                console.log(error)
                showNotification('error', error.response?.data?.error || 'Erro ao buscar o endereço.' );
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id, addressId]);

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Endereço do Fornecedor
                </div>
                
                <DetailsSectionRenderer
                    sections={addressFields}
                    formData={formData}
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

export default SupplierAddressDetailsPage;
