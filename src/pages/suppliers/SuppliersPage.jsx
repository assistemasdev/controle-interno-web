import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import MyAlert from "../../components/MyAlert";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { usePermissions } from "../../hooks/usePermissions";
import { CircularProgress } from '@mui/material';
import DynamicTable from "../../components/DynamicTable";
import SupplierService from "../../services/SupplierService";
import { useNavigate, useLocation } from "react-router-dom";
import { faEdit  } from '@fortawesome/free-solid-svg-icons';
import { maskCpf, maskCnpj } from "../../utils/maskUtils";

const SuppliersPage = () => {
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setMessage(null);
        if (location.state?.message) {
            setMessage({type:location.state.type, text: location.state.message});
        }
    }, [location.state]); 
    
    const handleClearFilters = () => {
        setName('');
    };

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
        
            const response = await SupplierService.getAll(navigate);
            const result = response.result
        
            const filteredSuppliers = result.map(supplier => {
                const numericValue = supplier.cpf_cnpj.replace(/\D/g, '');
            
                return {
                    id: supplier.id,
                    alias: supplier.alias,
                    name: supplier.name,
                    cpf_cnpj: numericValue.length <= 11 ? maskCpf(numericValue) : maskCnpj(numericValue) 
                };
            });
            
            setSuppliers(filteredSuppliers);
        } catch (error) {
            setError('Erro ao carregar fornecedores');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (supplier) => {
        navigate(`/fornecedores/editar/${supplier.id}`);
    };

    const headers = ['id', 'Apelido', 'Nome', 'CPF/CPNPJ'];

    const actions = [
        {
            icon: faEdit,
            title: 'Editar Fornecedor',
            buttonClass: 'btn-primary',
            permission: 'Atualizar fornecedores',
            onClick: handleEdit
        }
    ];
    
    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Fornecedores
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={() => console.log('oi')}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}
                    <div className="form-group col-md-12">
                        <InputField
                            label='Nome do fornecedores:'
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do fornecedor"
                        />
                    </div>
                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                    <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                        Lista de Fornecedores
                    </div>
                    {canAccess('Criar fornecedores') && (
                        <Button
                        text="Novo Fornecedor"
                        className="btn btn-blue-light fw-semibold"
                        link="/fornecedores/criar"
                        />
                    )}
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                    ) : error ? (
                    <div className='mt-3'>
                        <MyAlert notTime={true} severity="error" message={error} />
                    </div>
                    ) : (
                    <DynamicTable headers={headers} data={suppliers} actions={actions} />
                )}

            </div>
        </MainLayout>
    )
}

export default SuppliersPage;