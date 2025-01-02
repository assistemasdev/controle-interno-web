import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Form from '../../components/Form';
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

    const memoizedInitialData = useMemo(() => formData, [formData]);

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
                    initialFormData={memoizedInitialData}
                    onSubmit={handleSubmit}
                    textSubmit="Atualizar"
                    textLoadingSubmit="Atualizando..."
                    handleBack={handleBack}
                >
                    {({ formData, handleChange }) => (
                        userProfileFields.map((field) => (
                            <div key={field.id}>
                                <h5>{field.section}</h5>
                                <hr />
                                <div className="form-row">
                                    {field.fields.map((item) => (
                                        <div className="d-flex flex-column col-md-6" key={item.id}>
                                            <InputField
                                                label={item.label}
                                                type={item.type}
                                                id={item.id}
                                                value={formData[item.id]}
                                                onChange={handleChange}
                                                placeholder={item.placeholder}
                                                error={formErrors[item.id]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </Form>
            </div>
        </MainLayout>
    );
};

export default PerfilUserPage;
