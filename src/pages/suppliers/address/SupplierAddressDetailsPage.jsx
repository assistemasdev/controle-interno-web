import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CircularProgress } from '@mui/material';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import SupplierService from '../../../services/SupplierService';
import { maskCep } from '../../../utils/maskUtils';

const SupplierAddressDetailsPage = () => {
    const navigate = useNavigate();
    const { id, addressId } = useParams();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleBack = () => {
        navigate(`/fornecedores/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes do Endereço do Fornecedor
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
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
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="CEP:"
                                        type="text"
                                        id="zip"
                                        value={formData.zip}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="d-flex flex-column col-md-6">
                                    <InputField
                                        label="Rua:"
                                        type="text"
                                        id="street"
                                        value={formData.street}
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Número:"
                                        type="text"
                                        id="number"
                                        value={formData.number}
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-3">
                                    <InputField
                                        label="Detalhes:"
                                        type="text"
                                        id="details"
                                        value={formData.details}
                                        disabled
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
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Cidade:"
                                        type="text"
                                        id="city"
                                        value={formData.city}
                                        disabled
                                    />
                                </div>
                                <div className="d-flex flex-column col-md-4">
                                    <InputField
                                        label="Estado:"
                                        type="text"
                                        id="state"
                                        value={formData.state}
                                        disabled
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
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default SupplierAddressDetailsPage;
