import React, { useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import Button from '../../../components/Button';
import useNotification from '../../../hooks/useNotification';
import useLoader from '../../../hooks/useLoader';
import useForm from '../../../hooks/useForm';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import { typeEventsFields } from '../../../constants/forms/typeEventsFields';
import DetailsSectionRenderer from '../../../components/DetailsSectionRenderer';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

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

    const handleBack = () => {
        navigate(`/contratos/tipos-eventos/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Tipo de Eventos
                </div>

                <DetailsSectionRenderer formData={formData} sections={typeEventsFields}/>

                <div className="form-row gap-2">
                    <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsTypeEventsPage;
