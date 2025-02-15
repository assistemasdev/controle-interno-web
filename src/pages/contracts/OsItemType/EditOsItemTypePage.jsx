import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import useLoader from '../../../hooks/useLoader';
import { osItemTypeFields } from '../../../constants/forms/osItemTypeFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';

const EditOsItemTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchOsItemTypeById, put: updateOsItemType, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(osItemTypeFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const typeData = await fetchOsItemTypeById(entities.orders.itemsTypes.getByColumn(null, id));
                formatData(typeData.result, osItemTypeFields);
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
            await updateOsItemType(entities.orders.itemsTypes.update(null, id), formData);
        } catch (error) {
            console.error('Erro ao atualizar o tipo:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/ordem-servico/tipos-itens');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Tipo de Evento de Contrato" showBackButton={true} backUrl="/contratos/ordem-servico/tipos-itens"/>

            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osItemTypeFields.map((section) => (
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

export default EditOsItemTypePage;
