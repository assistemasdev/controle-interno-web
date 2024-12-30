import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import { CircularProgress } from '@mui/material'; 
import '../../../assets/styles/custom-styles.css';
import MyAlert from '../../../components/MyAlert';
import Select from 'react-select';  
import UnitService from '../../../services/UnitService';
import Form from '../../../components/Form';

const AttachUnitsRelatedPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true); 

    const [units, setUnits] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchUnits(), fetchAttachedUnits()]);
        } catch (error) {
            console.error('Erro ao carregar os dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchUnits = async () => {
        try {
            const response = await UnitService.getAll(navigate);
            const formattedUnits = response.result.data.map(unit => ({
                value: unit.id,
                label: unit.name
            }));
            setUnits(formattedUnits);  
        } catch (error) {
            setMessage({ type:'error', text: error.response?.data?.error || 'Erro ao buscar unidades' });
            console.error(error);
        }
    };

    const fetchAttachedUnits = async () => {
        try {
            const response = await UnitService.allOutputUnits(id, navigate);
            const attachedUnits = response.result.map(unit => unit.id);
            setSelectedUnits(attachedUnits);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Erro ao buscar unidades atreladas' });
        }
    };

    const handleSubmit = async (formData) => {
        setMessage(null);

        try {
            const response = await UnitService.syncOutputUnits(id, { units: formData.units }, navigate);
            setMessage({ type:'success', text: response.message });
            await fetchData();
        } catch (error) {
            setMessage({ type:'error', text: error?.data?.units[0] || 'Erro ao atrelar unidade' });
        }
    };

    const handleBack = () => {
        navigate(`/unidades/`);
    };

    const initialFormData = {
        units: selectedUnits,
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associar Unidade
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        initialFormData={initialFormData}
                        onSubmit={handleSubmit}
                        className="p-3 mt-2 rounded shadow-sm mb-2"
                        textSubmit="Associar Unidade"
                        textLoadingSubmit="Associando..."
                        handleBack={handleBack}
                    >
                        {({ formData, handleChange }) => (
                            <>
                                {message && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage(null)} />}

                                <div className="form-group" style={{ marginLeft: '0px' }}>
                                    <label htmlFor="units" className='text-dark font-weight-bold '>Unidades:</label>
                                    <Select
                                        isMulti
                                        name="units"
                                        options={units}  
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={units.filter(unit => formData.units.includes(unit.value))}
                                        onChange={(selectedOptions) => handleChange({ target: { id: 'units', value: selectedOptions ? selectedOptions.map(option => option.value) : [] } })}
                                        noOptionsMessage={() => "Nenhuma unidade encontrada"}
                                        placeholder="Selecione as unidades"
                                    />
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </MainLayout>
    );
};

export default AttachUnitsRelatedPage;
