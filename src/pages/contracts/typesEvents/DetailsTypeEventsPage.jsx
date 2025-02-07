import React, { useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { typeEventsFields } from '../../../constants/forms/typeEventsFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const DetailsTypeEventsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showNotification } = useNotification();
    const { showLoader, hideLoader } = useLoader();
    const { formData, formatData } = useForm(setDefaultFieldValues(typeEventsFields))
    const { getByColumn: fetchById } = useBaseService(navigate);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                showLoader();
                const [typesEventResponse] = await Promise.all([
                    fetchById(entities.contracts.eventsTypes.getByColumn(null, id)),
                ]);
    
                formatData(typesEventResponse.result, typeEventsFields);
            } catch (error) {
                console.error('Erro ao carregar detalhes do tipo:', error);
                showNotification('error', 'Erro ao carregar os dados.');
            } finally {
                hideLoader();
            }
        };
    
        fetchProductDetails();
    }, [id, navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Detalhes do Tipo de Eventos" showBackButton={true} backUrl="/contratos/tipos-eventos"/>

            <div className="container-fluid p-1">
                <DetailsSectionRenderer formData={formData} sections={typeEventsFields}/>
            </div>
        </MainLayout>
    );
};

export default DetailsTypeEventsPage;
