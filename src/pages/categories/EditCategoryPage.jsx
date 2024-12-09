import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import CategoryService from '../../services/CategoryService';
import { usePermissions } from '../../hooks/usePermissions';

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', color: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchCategory();
    
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        };
    
        fetchData();
    }, [id])


    const fetchCategory = async () => {
        try {
        const response = await CategoryService.getById(id, navigate);

        if (response.status === 200) {
            setFormData({
                name: response.result.name,
            });
        }

        if (response.status === 404) {
            navigate(
                '/categorias/', 
                {
                    state: { 
                        type: 'error', 
                        message: response.message 
                    }
                }
            );
        }

        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar pela categoria' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({  name: '', color: '', active: '' });
        setMessage(null);

        try {
            const response = await CategoryService.update(id, formData, navigate);

            if (response.status === 200) {
                setMessage({ type:'success', text: response.message });
            }

            if (response.status === 422) {
                const errors = response.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                });
            }

            if (response.status === 404) {
                setMessage({ type:'error', text: response.message });
            } 

        } catch (error) {
            console.log(error)
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao editar a categoria' });
        }
    };

    const handleBack = () => {
        navigate(`/categorias/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Categoria
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-row">

                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label='Nome:'
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome da categoria"
                                        error={formErrors.name}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                { canAccess('Atualizar categorias de produto') && (
                                    <Button type="submit" text="Atualizar Tipo" className="btn btn-blue-light fw-semibold" />
                                )}
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default EditCategoryPage;
