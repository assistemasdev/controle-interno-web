import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Form from '../../components/Form';
import FormSection from '../../components/FormSection';
import { userProfileFields } from '../../constants/forms/userProfileFields';
import useUserService from '../../hooks/useUserService';
import useLoader from '../../hooks/useLoader';

const PerfilUserPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const { formErrors, fetchUserById, updateUser } = useUserService(navigate);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const user = await fetchUserById(id);
                setFormData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: '',
                    password_confirmation: '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async (data) => {
        showLoader();
        try {
            await updateUser(id, data);
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
                    initialFormData={formData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
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
