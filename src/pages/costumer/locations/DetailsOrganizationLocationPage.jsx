import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import OrganizationService from '../../../services/OrganizationService';

const DetailsCustomerLocationPage = () => {
    const navigate = useNavigate();
    const { id, addressId, locationId } = useParams(); 
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        area: '',
        section: '',
        spot: '',
        details: ''
    });

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await OrganizationService.showOrganizationLocation(
                    id,
                    addressId,
                    locationId
                );
                const { area, section, spot, details } = response.result;

                setFormData({
                    area: area || '',
                    section: section || '',
                    spot: spot || '',
                    details: details || ''
                });
            } catch (error) {
                setMessage({ type: 'error', text: 'Erro ao carregar os dados da localização' });
                console.error(error);
            }
        };

        fetchLocationData();
    }, [id, addressId, locationId]);

    const handleBack = () => {
        navigate(`/clientes/detalhes/${id}/enderecos/${addressId}/localizacoes`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Detalhes da Localização
                </div>

                <div className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Área:"
                                type="text"
                                id="area"
                                value={formData.area}
                                placeholder="Área não definida"
                                disabled={true}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Seção:"
                                type="text"
                                id="section"
                                value={formData.section}
                                placeholder="Seção não definida"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Ponto:"
                                type="text"
                                id="spot"
                                value={formData.spot}
                                placeholder="Ponto não definido"
                                disabled={true}
                            />
                        </div>
                        <div className="d-flex flex-column col-md-6">
                            <InputField
                                label="Detalhes:"
                                type="text"
                                id="details"
                                value={formData.details}
                                placeholder="Detalhes não definidos"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="mt-3 d-flex gap-2">
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default DetailsCustomerLocationPage;
