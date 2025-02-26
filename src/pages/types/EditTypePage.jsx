import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import { typeFields } from '../../constants/forms/typeFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import PageHeader from '../../components/PageHeader';
import SimpleForm from '../../components/forms/SimpleForm';

const EditTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(typeFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const typeData = await fetchById(entities.types.getByColumn(id));
                formatData(typeData.result, typeFields);
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
            await update(entities.types.update(id), formData);
        } catch (error) {
            console.error('Erro ao atualizar o tipo:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/tipos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Tipos" showBackButton={true} backUrl="/tipos" /> 
            <div className="container-fluid p-1">
                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        typeFields.map((section) => (
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

export default EditTypePage;
