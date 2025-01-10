import React, { useEffect, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/custom-styles.css';
import useTypeService from '../../hooks/useTypeService';
import useForm from '../../hooks/useForm';
import useLoader from '../../hooks/useLoader';
import { typeFields } from '../../constants/forms/typeFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const EditTypePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchTypeById, updateType, formErrors } = useTypeService();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(typeFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const typeData = await fetchTypeById(id);
                formatData(typeData, typeFields);
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
            await updateType(id, formData);
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
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Tipo
                </div>

                <Form
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        typeFields.map((section) => (
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

export default EditTypePage;
