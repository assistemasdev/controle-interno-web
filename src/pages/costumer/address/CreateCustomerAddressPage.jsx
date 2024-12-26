import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import CustomerService from '../../../services/CustomerService';
import { maskCep, removeMask } from '../../../utils/maskUtils';
import { usePermissions } from '../../../hooks/usePermissions';

const CreateCustomerAddressPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [loadingCep, setLoadingCep] = useState(false); 
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
                setMessage({ type: 'success', text: 'Endereço preenchido automaticamente!' });
            } catch (error) {
                setMessage({ type: 'error', text: error.message });
            } finally {
                setLoadingCep(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage(null);

        const sanitizedData = {
            ...formData,
            zip: removeMask(formData.zip)
        }

        try {
            const response = await CustomerService.addCustomerAddress(id, sanitizedData, navigate);
            setMessage({ type: 'success', text: response.message });
            setFormData({
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
            console.log(error);
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao criar endereço' });
        }
    };

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Endereço do Cliente
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}
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
                            {loadingCep && <p>Carregando endereço...</p>}
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
                        {canAccess('Adicionar endereço ao fornecedor') && (
                            <Button type="submit" text="Cadastrar Endereço" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateCustomerAddressPage;
