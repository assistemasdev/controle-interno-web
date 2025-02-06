import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import PageHeader from '../../../components/PageHeader';
import '../../../assets/styles/custom-styles.css';
import { maskCep } from '../../../utils/maskUtils';
import useLoader from '../../../hooks/useLoader';
import { addressFields } from '../../../constants/forms/addressFields';
import useForm from '../../../hooks/useForm';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const CostumerAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const { formData, setFormData, formatData } = useForm(setDefaultFieldValues(addressFields));
    const { showLoader, hideLoader } = useLoader();
    const { getByColumn: fetchById } = useBaseService(navigate);
    
    useEffect(() => {
        fetchAddress();
    }, [id]);

    const fetchAddress = async () => {
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
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Endereço do Cliente" showBackButton={true} backUrl={`/clientes/detalhes/${id}`} />
            <div className="container-fluid p-1">
                <DetailsSectionRenderer sections={addressFields} formData={formData}/>
            </div>
        </MainLayout>
    );
};

export default CostumerAddressDetailsPage;
