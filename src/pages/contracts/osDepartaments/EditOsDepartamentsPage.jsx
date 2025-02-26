import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import FormSection from '../../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css';
import useForm from '../../../hooks/useForm';
import useLoader from '../../../hooks/useLoader';
import { osDepartamentsFields } from '../../../constants/forms/osDepartamentsFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SimpleForm from '../../../components/forms/SimpleForm';

const EditOsDepartamentsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(osDepartamentsFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const data = await fetchById(entities.orders.departaments.getByColumn(null, id));
                formatData(data.result, osDepartamentsFields);
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
            await update(entities.orders.departaments.update(null, id), formData);
        } catch (error) {
            console.error('Erro ao atualizar o departamento:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/contratos/ordem-servico/departamentos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Departamento de Ordem de Serviço" showBackButton={true} backUrl="/contratos/ordem-servico/departamentos"/>

            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        osDepartamentsFields.map((section) => (
                            <SimpleForm
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

export default EditOsDepartamentsPage;
