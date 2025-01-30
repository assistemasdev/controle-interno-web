import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import useLoader from '../../../hooks/useLoader';
import { osDestinationFields } from '../../../constants/forms/osDestinationFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';

const EditOsDestinationsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(osDestinationFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const data = await fetchById(entities.orders.destinations.getByColumn(null, id));
                formatData(data.result, osDestinationFields);
            } catch (error) {
                console.log(error)
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();
        try {
            await update(entities.orders.destinations.update(null, id), formData);
        } catch (error) {
            console.error('Erro ao atualizar o destino:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/ordem-servico/destinos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Destino de Ordem de Serviço
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osDestinationFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditOsDestinationsPage;
