import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import SupplierService from '../../../services/SupplierService';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import { usePermissions } from '../../../hooks/usePermissions';

const EditSupplierAddressPage = () => {
    const { canAccess } = usePermissions();
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingCep, setLoadingCep] = useState(false)
    const [formData, setFormData] = useState({
        alias: '',
        zip: '',
        street: '',
        number: '',
        details: '',
        district: '',
        city: '',
        state: '',
        country: ''
    });

    const handleChange = async (e) => {
        const { id, value } = e.target;
    
        const maskedValue = id === 'zip' ? maskCep(value) : value;
        setFormData((prev) => ({
            ...prev,
            [id]: maskedValue
        }));
    
        if (id === 'zip' && removeMask(value).length === 8) {
            setLoadingCep(true); 
            try {
                const response = await fetch(`https://viacep.com.br/ws/${removeMask(value)}/json/`);
                if (!response.ok) throw new Error('Erro ao buscar o CEP');
                
                const data = await response.json();
                if (data.erro) throw new Error('CEP não encontrado');
    
                setFormData((prev) => ({
                    ...prev,
                    street: data.logradouro || '',
                    district: data.bairro || '',
                    city: data.localidade || '',
                    state: data.uf || '',
                    country: 'Brasil' 
                }));
            } catch (error) {
                setMessage({ type: 'error', text: error.message });
            } finally {
                setLoadingCep(false); 
            }
        }
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchAddress();
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };

        fetchData();
    }, [id]);

    const fetchAddress = async () => {
        try {
            const response = await SupplierService.showSupplierAddress(id, addressId, navigate);
            const address = response.result;

            if (response.status === 200) {
                setFormData({
                    alias: address.alias || '',
                    zip: maskCep(address.zip || ''),
                    street: address.street || '',
                    number: address.number || '',
                    details: address.details || '',
                    district: address.district || '',
                    city: address.city || '',
                    state: address.state || '',
                    country: address.country || ''
                });

                return;
            }

            if (response.status === 404) {
                navigate(
                    '/fornecedores/',
                    {
                        state: {
                            type: 'error',
                            message: response.message
                        }
                    }
                );
            }

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar pelo endereço' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage(null);

        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        };

        try {
            const response = await SupplierService.updateSupplierAddress(id, addressId, sanitizedData, navigate);
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            if (error.status === 422) {
                const errors = error.data;
                setFormErrors({
                    alias: errors?.alias?.[0] || '',
                    zip: errors?.zip?.[0] || '',
                    street: errors?.street?.[0] || '',
                    number: errors?.number?.[0] || '',
                    details: errors?.details?.[0] || '',
                    district: errors?.district?.[0] || '',
                    city: errors?.city?.[0] || '',
                    state: errors?.state?.[0] || '',
                    country: errors?.country?.[0] || ''
                });
                return
            }
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao editar o endereço' });
        }
    };

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Edição de Endereço do Fornecedor
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Apelido:"
                                        type="text"
                                        id="alias"
                                        value={formData.alias}
                                        onChange={handleChange}
                                        placeholder="Digite o apelido do endereço"
                                        error={formErrors.alias}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="CEP:"
                                        type="text"
                                        id="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        placeholder="Digite o CEP"
                                        error={formErrors.zip}
                                    />
                                    {loadingCep && (
                                        <div className="mt-2">
                                            <CircularProgress size={20} /> Carregando endereço...
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Rua:"
                                        type="text"
                                        id="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Digite a rua"
                                        error={formErrors.street}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Número:"
                                        type="text"
                                        id="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        placeholder="Digite o número"
                                        error={formErrors.number}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Detalhes:"
                                        type="text"
                                        id="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        placeholder="Digite os detalhes"
                                        error={formErrors.details}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Bairro:"
                                        type="text"
                                        id="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Digite o bairro"
                                        error={formErrors.district}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Cidade:"
                                        type="text"
                                        id="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Digite a cidade"
                                        error={formErrors.city}
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Estado:"
                                        type="text"
                                        id="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Digite o estado"
                                        error={formErrors.state}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-12">
                                    <InputField
                                        label="País:"
                                        type="text"
                                        id="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Digite o país"
                                        error={formErrors.country}
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                {canAccess('Atualizar endereço do fornecedor') && (
                                    <Button type="submit" text="Atualizar Endereço" className="btn btn-blue-light fw-semibold" />
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

export default EditSupplierAddressPage;
