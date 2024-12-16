import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import { CircularProgress } from '@mui/material'; 
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import Select from 'react-select';  
import UnitService from '../../../services/UnitService';

const AttachUnitsRelatedPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true); 

    const [units, setUnits] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);


    const handleUnitChange = (selectedOptions) => {
        setSelectedUnits(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchUnits();
            await fetchAttachedUnits();
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        }
        };
    
        fetchData();
    }, [id])


    const fetchUnits = async () => {
        try {
            const response = await UnitService.getAll(navigate);
            const formattedUnits = response.result.map(unit => ({
                value: unit.id,
                label: unit.name
            }));
            setUnits(formattedUnits);  
        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar unidades' });
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const fetchAttachedUnits = async () => {
        try {
            const response = await UnitService.allOutputUnits(id, navigate);
            const attachedUnits = response.result.map(unit => unit.id);
            setSelectedUnits(attachedUnits);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar unidades atreladas' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await UnitService.syncOutputUnits(id, {units: selectedUnits}, navigate);
            setMessage({ type:'success', text: response.message });
            return;
            
        } catch (error) {
            console.log(error)
            setMessage({ type:'error', text: error?.data?.units[0] || 'Erro ao atrelar unidade' });
        }
    };

    const handleBack = () => {
        navigate(`/unidades/${id}/relacionadas`);
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associonar Unidade
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage('')} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginLeft: '0px' }}>
                                <label htmlFor="roles" className='text-dark font-weight-bold '>Unidades:</label>
                                <Select
                                    isMulti
                                    name="Unidades"
                                    options={units}  
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={units.filter(unit => selectedUnits.includes(unit.value))}
                                    onChange={handleUnitChange}  
                                    noOptionsMessage={() => "Nenhuma unidade encontrada"}
                                    placeholder="Selecione as unidades"
                                />
                            </div>

                            <div className="mt-3 d-flex gap-2">
                                <Button type="submit" text="Associar Unidade" className="btn btn-blue-light fw-semibold" />
                                <Button type="button" text="Voltar" className="btn btn-blue-light fw-semibold" onClick={handleBack} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </MainLayout>
    );
};

export default AttachUnitsRelatedPage;
