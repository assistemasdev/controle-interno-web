import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import InputField from '../../components/InputField'; 
import Button from '../../components/Button'; 
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/custom-styles.css'; 
import MyAlert from '../../components/MyAlert';
import { usePermissions } from '../../hooks/usePermissions';
import ConditionService from '../../services/ConditionService';

const CreateConditionPage = () => {
    const navigate = useNavigate(); 
    const { canAccess } = usePermissions();

    const [formData, setFormData] = useState({
        name: '',
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [formErrors, setFormErrors] = useState({    
        name: '',
    }); 

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setMessage({ type: '', text: '' });
    
        try {
            const response = await ConditionService.create(formData, navigate);
            const {  message } = response; 
    
            setMessage({ type: 'success', text: message });
            setFormData({
                name: '',
            });
            return;
    
        } catch (error) {
            if (error.status === 422) {
                setFormErrors({
                    name: error.data.name?.[0] || ''
                });
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate(`/condicoes/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Cadastro de Condição
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}


                    <div className="form-row">
                        <div className="d-flex flex-column col-md-12">
                            <InputField
                                label="Condições:"
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite o nome da condição"
                                error={formErrors.name} 
                            />
                        </div>
                    </div>

                    <div className="mt-3 form-row gap-2">
                        {canAccess('Criar condição de produtos') && (
                            <Button type="submit" text="Cadastrar Condição" className="btn btn-blue-light fw-semibold" />
                        )}
                        <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                    </div>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateConditionPage;
