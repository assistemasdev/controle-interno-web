import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import useGroupService from '../../hooks/useGroupService';
import useLoader from '../../hooks/useLoader';
import useNotification from '../../hooks/useNotification';
import useForm from '../../hooks/useForm';
import { groupFields } from '../../constants/forms/groupFields';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const EditGroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getById, updateGroup, formErrors } = useGroupService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(groupFields));

    const fetchGroup = useCallback(async () => {
        try {
            showLoader();
            const response = await getById(id);
            formatData(response, groupFields);
        } catch (error) {
            showNotification('error', 'Erro ao carregar os dados do grupo.');
        } finally {
            hideLoader();
        }
    }, [id, getById, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchGroup();
    }, [id]);

    const handleSubmit = async () => {
        try {
            showLoader();
            await updateGroup(id, formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/grupos');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Grupo
                </div>

                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        groupFields.map((section) => (
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

export default EditGroupPage;
