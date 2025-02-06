import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';
import { useAuth } from '../../hooks/useAuth';
import useBaseService from '../../hooks/services/useBaseService';
import { entities } from '../../constants/entities';
import { removeEmptyValues } from '../../utils/objectUtils';
import PageHeader from '../../components/PageHeader'; 

const PerfilUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(userProfileFields));
    const { user } = useAuth();
    const { formErrors, getByColumn: fetchById, put: update } = useBaseService(navigate);

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                if (user.id != id) {
                    navigate('/dashboard', { state: { type: 'error', message: 'Usuário inválido!' } });
                }

                const userData = await fetchById(entities.users.getByColumn(id));
                formatData(userData.result, userProfileFields);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        showLoader();
        try {
            const formattedData = removeEmptyValues(formData);
            await update(entities.users.update(id), formattedData);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            hideLoader();
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <PageHeader title="Perfil do Usuário" showBackButton={true} backUrl="/dashboard" /> 
            
            <div className="container-fluid p-1">
                <Form
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    initialFormData={formData}
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {() =>
                        userProfileFields.map((section) => (
                            <FormSection
                                key={section.section}
                                section={section}
                                formData={formData}
                                handleFieldChange={handleChange}
                                getOptions={() => []}
                                getSelectedValue={() => null}
                                formErrors={formErrors}
                            />
                        ))
                    }
                </Form>
            </div>
        </MainLayout>
    );
};

export default PerfilUserPage;
