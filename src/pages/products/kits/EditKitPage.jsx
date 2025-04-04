import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import Form from '../../../components/Form';
import useLoader from '../../../hooks/useLoader';
import useNotification from '../../../hooks/useNotification';
import useForm from '../../../hooks/useForm';
import { kitFields } from '../../../constants/forms/kitFields';
import { setDefaultFieldValues } from '../../../utils/objectUtils';
import useBaseService from '../../../hooks/services/useBaseService';
import { entities } from '../../../constants/entities';
import PageHeader from '../../../components/PageHeader';
import SectionHeader from '../../../components/forms/SectionHeader';
import SimpleBody from '../../../components/forms/SimpleBody';

const EditKitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getByColumn: fetchById, put: update, formErrors } = useBaseService(navigate);
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const { formData, handleChange, setFormData, formatData } = useForm(setDefaultFieldValues(kitFields));

    const fetchGroup = useCallback(async () => {
        try {
            showLoader();
            const response = await fetchById(entities.equipamentsKits.getByColumn(id));
            formatData(response.result, kitFields);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    }, [id, fetchById, setFormData, showLoader, hideLoader, showNotification]);

    useEffect(() => {
        fetchGroup();
    }, [id]);

    const handleSubmit = async () => {
        try {
            showLoader();
            await update(entities.equipamentsKits.getByColumn(id), formData);
        } catch (error) {
            console.log(error)
        } finally {
            hideLoader();
        }
    };

    const handleBack = useCallback(() => {
        navigate('/kits');
    }, [navigate]);

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Edição de Kit" showBackButton={true} backUrl="/kits" /> 
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    initialFormData={formData}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        kitFields.map((section) => (
                            <>
                             <SectionHeader
                                    key={section.section}
                                    section={section}
                                    viewTable={false}
                                    setViewTable={() => {}}
                                    addFieldsInData={() => {}}
                            
                                />
                                <SimpleBody
                                    fields={section.fields}
                                    formErrors={formErrors}
                                    formData={formData}
                                    handleFieldChange={handleChange}
                                    getOptions={() => {}}
                                    getSelectedValue={() => {}}
                                />
                            </>
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default EditKitPage;
