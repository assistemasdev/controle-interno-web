import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../assets/styles/custom-styles.css'; 
import MyAlert from '../../../components/MyAlert';
import TypeGroupsService from '../../../services/TypeGroupsService';
import GroupService from '../../../services/GroupService';
import Select from 'react-select';  
import Form from '../../../components/Form';
import { CircularProgress } from '@mui/material';

const AttachGroupToTypePage = () => {
    const navigate = useNavigate(); 
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const { id } = useParams();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        groups: selectedGroups.map(group => group.value)
    })
    const initialFormData = useMemo(() => ({
        groups: selectedGroups.map(group => group.value),
    }), [selectedGroups]);

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [groupsOfTheTypesResponse, groupsResponse] = await Promise.all([
                await TypeGroupsService.showTypeGroups(id, navigate),
                await GroupService.getAll(navigate)
            ])

            const groupsOfTheTypes = groupsOfTheTypesResponse.result.map(role => ({
                id: role.id,
                name: role.name
            }));

            setGroups(groupsResponse.result.data.map((option) => ({
                value: option.id,
                label: option.name
            })));

            setSelectedGroups(groupsOfTheTypes.map((option) => ({
                value: option.id,
                label: option.name
            })))
        } catch (error) {
            setMessage({type:'error', message:'Erro ao carregar grupos'});
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    const handleGroupsChange = (selectedOptions) => {
        setSelectedGroups(selectedOptions || []); 
        setFormData((prev) => ({
            ...prev,
            groups: selectedOptions ? selectedOptions.map(option => option.value) : [], 
        }));
    };

    const handleSubmit = async (formData) => {
        setMessage({ type: '', text: '' });

        try {
            const response = await TypeGroupsService.attachGroupToType(id, formData, navigate);
            const { message } = response; 
        
            setMessage({ type: 'success', text: message });
            fetchData();
        } catch (error) {
            if (error.status === 422 && error.data) {
                setMessage({ type: 'error', text: error.data.groups[0] });
                return;
            }
            setMessage({ type: 'error', text: 'Erro ao realizar o cadastro' });
        }
    };

    const handleBack = () => {
        navigate(`/tipos/`);  
    };

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Associar Grupos
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <CircularProgress size={50} />
                    </div>
                ) : (
                    <Form
                        initialFormData={initialFormData}
                        onSubmit={handleSubmit}
                        className="p-3 mt-2 rounded shadow-sm mb-2"
                        textSubmit="Associar"
                        textLoadingSubmit="Associando..."
                        handleBack={handleBack}
                    >
                        {() => (
                            <>
                                {message.text && <MyAlert severity={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />}

                                <div className="form-row">
                                    <div className="d-flex flex-column col-md-12">
                                    <Select
                                        isMulti
                                        name="groups"
                                        options={groups}  
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={groups.filter(group => selectedGroups.some(selected => selected.value === group.value))}
                                        onChange={handleGroupsChange}  
                                        noOptionsMessage={() => "Nenhum grupo encontrado"}
                                        placeholder="Selecione os grupos"
                                    />
                                    </div>
                                </div>
                            </>
                        )}

                    </Form>
                )}
            </div>
        </MainLayout>
    );
};

export default AttachGroupToTypePage;
