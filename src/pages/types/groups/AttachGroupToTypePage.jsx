import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import Button from '../../../components/Button'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css'; 
import MyAlert from '../../../components/MyAlert';
import { usePermissions } from '../../../hooks/usePermissions';
import TypeGroupsService from '../../../services/TypeGroupsService';
import GroupService from '../../../services/GroupService';
import Select from 'react-select';  
import { CircularProgress } from '@mui/material'; 

const AttachGroupToTypePage = () => {
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [groupsOfTheTypes, setGroupsOfTheTypes] = useState([]);
    const [observer, setObserver] = useState(false);
    const { id } = useParams();
    const { canAccess } = usePermissions();
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchGroupsOfTheTypes();
        setObserver(false)
    }, [observer]);

    useEffect(() => {
        fetchGroup();
    }, [groupsOfTheTypes]);

    const fetchGroup = async () => {
        try {
            setLoading(true);
    
            const response = await GroupService.getAll(navigate);
            const result = response.result;
            const filteredGroups = result
                .filter(group => !groupsOfTheTypes.some(g => g.id === group.id))
                .map(group => ({
                    value: group.id,
                    label: group.name
                }));
    
            setGroups(filteredGroups);
        } catch (error) {
            setError('Erro ao carregar grupos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupsChange = (selectedOptions) => {
        setSelectedGroups(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const fetchGroupsOfTheTypes = async () => {
        try {
            setLoading(true);
        
            const response = await TypeGroupsService.showTypeGroups(id,navigate);
            const result = response.result
        
            const groupsOfTheTypes = result.map(role => ({
                id: role.id,
                name: role.name
            }));
        
            setGroupsOfTheTypes(groupsOfTheTypes);
        } catch (error) {
            setError('Erro ao carregar grupos do tipo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
    
        try {
            const response = await TypeGroupsService.attachGroupToType(id, { groups: selectedGroups }, navigate);
            const { status, data, message } = response; 
        
            if (status === 200) {
                setMessage({ type: 'success', text: message });
                setSelectedGroups([])
                setObserver(true);
                return;
            }
        
            if (status === 422 && data) {
                setMessage({ type: 'error', text: data.group_id[0] });
                return;
            }
        
            setMessage({ type: 'error', text: message || 'Erro ao realizar o cadastro' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate(`/tipos/${id}/grupos`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associar Grupos
                </div>

                <form className="p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleSubmit}>
                    {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                    {loading ? (
                        <div className="d-flex justify-content-center mt-4">
                            <CircularProgress size={50} />
                        </div>
                    ) : (
                        <>
                        <div className="form-row">
                            <div className="d-flex flex-column col-md-12">
                            <Select
                                isMulti
                                name="groups"
                                options={groups}  
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={groups.filter(permission => selectedGroups.includes(permission.value))}
                                onChange={handleGroupsChange}  
                                noOptionsMessage={() => "Nenhum grupo encontrado"}
                                placeholder="Selecione os grupos"
                            />
                            </div>
                        </div>

                        <div className="mt-3 form-row gap-2">
                            {canAccess('Criar tipos de produto') && (
                                <Button type="submit" text="Associar grupos" className="btn btn-blue-light fw-semibold" />
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

export default AttachGroupToTypePage;
