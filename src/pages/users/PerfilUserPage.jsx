import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useUserService from '../../hooks/useUserService';
import useLoader from '../../hooks/useLoader';
import useForm from '../../hooks/useForm';
import { setDefaultFieldValues } from '../../utils/objectUtils';

const PerfilUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formErrors, fetchUserById, updateUser } = useUserService(navigate);
    const { formData, handleChange, formatData } = useForm(setDefaultFieldValues(userProfileFields));

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const user = await fetchUserById(id);
                formatData(user, userProfileFields);
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
            await updateUser(id, formData);
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
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Perfil do Usuário
                </div>

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
