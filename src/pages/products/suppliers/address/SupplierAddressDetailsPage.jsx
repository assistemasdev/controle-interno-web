import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../../layouts/MainLayout';
import '../../../../assets/styles/custom-styles.css';
import DetailsSectionRenderer from '../../../../components/DetailsSectionRenderer';
import { addressFields } from '../../../../constants/forms/addressFields';
import useLoader from '../../../../hooks/useLoader';
import { maskCep } from '../../../../utils/maskUtils';
import useForm from '../../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../../utils/objectUtils';
import useBaseService from '../../../../hooks/services/useBaseService';
import { entities } from '../../../../constants/entities';
import PageHeader from '../../../../components/PageHeader';

const SupplierAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { showLoader, hideLoader } = useLoader();
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
            <PageHeader title="Detalhes do Endereço do Fornecedor" showBackButton={true} backUrl={`/fornecedores/detalhes/${id}`} /> 
            <div className="container-fluid p-1">
                <DetailsSectionRenderer
                    sections={addressFields}
                    formData={formData}
                />
            </div>
        </MainLayout>
    );
};

export default SupplierAddressDetailsPage;
