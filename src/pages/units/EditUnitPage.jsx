import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../assets/styles/custom-styles.css';
import MyAlert from '../../components/MyAlert';
import UnitService from '../../services/UnitService';
import { usePermissions } from '../../hooks/usePermissions';

const EditUnitPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({ name: '', abbreviation: '' });
    const [loading, setLoading] = useState(true); 
    const [formData, setFormData] = useState({
        name: '',
        abbreviation: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUnit();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };
    
        fetchData();
    }, [id]);

    const fetchUnit = async () => {
        try {
            const response = await UnitService.getById(id, navigate);

            setFormData({
                name: response.result.name,
                abbreviation: response.result.abbreviation || ''
            });
        } catch (error) {
            if (error.status === 404) {
                navigate(
                    '/unidades/', 
                    {
                        state: { 
                            type: 'error', 
                            message: error.message 
                        }
                    }
                );
            }
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar a unidade' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({ name: '', abbreviation: '' });
        setMessage(null);

        try {
            const response = await UnitService.update(id, formData, navigate);

            setMessage({ type:'success', text: response.message });
        } catch (error) {
            console.log(error);
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    name: errors?.name ? errors.name[0] : '',
                    abbreviation: errors?.abbreviation ? errors.abbreviation[0] : ''
                });
                return
            }
            setMessage({ type:'error', text: error.message || 'Erro ao editar a unidade' });
        }
    };

    const handleBack = () => {
        navigate(`/unidades/`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Unidade
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
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label='Nome:'
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Digite o nome da unidade"
                                        error={formErrors.name}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label='Abreviação:'
                                        type="text"
                                        id="abbreviation"
                                        value={formData.abbreviation}
                                        onChange={handleChange}
                                        placeholder="Digite a abreviação da unidade"
                                        error={formErrors.abbreviation}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                { canAccess('Atualizar unidades de medida') && (
                                    <Button type="submit" text="Atualizar Unidade" className="btn btn-blue-light fw-semibold" />
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

export default EditUnitPage;
