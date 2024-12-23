import React, { useState, useEffect } from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/DynamicTable';
import Button from '../../components/Button';
import ConfirmationModal from '../../components/modals/ConfirmationModal'; 
import '../../assets/styles/custom-styles.css';
import api from '../../services/api';
import MyAlert from '../../components/MyAlert';
import MainLayout from '../../layouts/MainLayout';  
import { CircularProgress } from '@mui/material';
import UserService from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PAGINATION } from '../../constants/pagination';
import Select from 'react-select';  
import { removeDuplicatesWithPriority } from '../../utils/arrayUtils';
const UsersPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { canAccess } = usePermissions();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
    const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.DEFAULT_PER_PAGE);
    const [totalPages, setTotalPages] = useState(PAGINATION.DEFAULT_TOTAL_PAGES);
    const [usersFilters,setUsersFilters] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [textFilter, setTextFilter] = useState('');
    const [inputValue, setInputValue] = useState();

    useEffect(() => {
        if (location.state?.message) {
        setErrorMessage(location.state.message);
        }
    }, [location.state]);

    const fetchUsers = async (ids, text ,page = 1) => {
        try {
            setLoading(true);

            const response = await UserService.getPaginated({ name:text, ids, page, perPage: itemsPerPage },navigate);
            const result = response.result

            const filteredUsers = result.data.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
            }));
            
            setUsers(filteredUsers);
            setTotalPages(result.last_page);
            setCurrentPage(result.current_page);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar usuários';
            setError(errorMessage);
        console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchUsers(
            selectedUsers.filter((user) => user.textFilter == false).map(user => (user.value)),
            selectedUsers.filter((user) => user.textFilter == true).map(user => (user.value))
        );
    };

    const handleChangeFilter = (selectedOptions) => {
        setSelectedUsers(selectedOptions);
        setTextFilter();
        setInputValue('');
    }

    const handleInputChange = (value, { action }) => {
        try {
            if(textFilter && textFilter.length == 0) {
                setUsersFilters([]);
            }

            if (action === 'input-change') {
                setTextFilter(value);
                setInputValue(value)
                fetchUserAutocomplete(value);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('Erro ao pesquisar pelo o usuário');
        }
    }

    const handleBlur = () => {
        if (textFilter && !selectedUsers.some(user => user.label === textFilter)) {
            setSelectedUsers([
                ...selectedUsers,
                { textFilter: true,value: textFilter, label: textFilter }, 
            ]);
        }
        setTextFilter(''); 
        setInputValue('');
    };
    
    const fetchUserAutocomplete = async (user) => {
        try {
            if(user.length > 0) {
                const response = await UserService.autocomplete({user}, navigate);
                console.log(response)
                const filteredUsers = removeDuplicatesWithPriority(
                    [
                        {textFilter:true, value: user, label: user},
                        ...response.result.map((user) => ({
                            textFilter: false,
                            value: user.id,
                            label: user.name
                        }))
                    ],
                    'label',
                    'textFilter'
                );

                setUsersFilters(filteredUsers)
            }

            if(user.length == 0) {
                setUsersFilters([])
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('Erro ao pesquisar pelo o usuário');
        }    
    }

    const handleClearFilters = (e) => {
        e.preventDefault();
        setSelectedUsers([]);
        setTextFilter('');
        setUsersFilters([]);
    };

    const handleEdit = (user) => {
        navigate(`/usuarios/editar/${user.id}`);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);  
        setOpenDeleteModal(true);  
    };
    
    const handleConfirmDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setSuccessMessage('Usuário excluído com sucesso!');
            setOpenDeleteModal(false);  
        } catch (error) {
            console.log(error)
            setErrorMessage('Erro ao excluir o usuário');
            setOpenDeleteModal(false);  
        }    
    };

    const handleCancelDelete = () => {
        setOpenDeleteModal(false);  
    };

    const headers = ['id', 'Nome', 'E-mail'];

    const actions = [
        {
        icon: faEdit,
        title: 'Editar usuário',
        buttonClass: 'btn-primary',
        permission: 'update users',
        onClick: handleEdit
        },
        {
        icon: faTrashAlt,
        title: 'Excluir usuário',
        buttonClass: 'btn-danger',
        permission:'delete users',
        onClick: handleDelete,
        },
    ];

    return (
        <MainLayout selectedCompany="ALUCOM">
            <div className="container-fluid p-1">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 text-dark">
                    Usuários
                </div>

                <form className="form-row p-3 mt-2 rounded shadow-sm mb-2" style={{ backgroundColor: '#FFFFFF' }} onSubmit={handleFilter}>
                    {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
                    {successMessage && <MyAlert severity="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

                        <div className="form-group col-md-12">
                            <label htmlFor="name" className='text-dark font-weight-bold mt-1'>Nome:</label>
                                <Select
                                    isMulti
                                    name="name"
                                    options={usersFilters} 
                                    className={`basic-multi-select`}
                                    classNamePrefix="select"
                                    inputValue={inputValue}
                                    value={selectedUsers}
                                    onInputChange={handleInputChange}
                                    onChange={handleChangeFilter}
                                    onBlur={handleBlur}
                                    noOptionsMessage={() => "Nenhum usuário encontrado"}
                                    placeholder="Filtre os usuários pelo nome"
                                />
                        </div>

                    <div className="form-group gap-2">
                        <Button type="submit" text="Filtrar" className="btn btn-blue-light fw-semibold m-1" />
                        <Button type="button" text="Limpar filtros" className="btn btn-blue-light fw-semibold m-1" onClick={handleClearFilters} />
                    </div>
                </form>

                <div className="form-row mt-4 d-flex justify-content-between align-items-center">
                <div className="font-weight-bold text-primary text-uppercase mb-1 text-dark d-flex">
                    Lista de usuários
                </div>
                {canAccess('create users') && (
                    <Button
                    text="Novo usuário"
                    className="btn btn-blue-light fw-semibold"
                    link="/usuarios/criar"
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
                <DynamicTable 
                    headers={headers} 
                    data={users} 
                    actions={actions} 
                    currentPage={currentPage} 
                    totalPages={totalPages}
                    onPageChange={fetchUsers} 
                />
                )}
                
                <ConfirmationModal
                open={openDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={() => handleConfirmDelete(selectedUser.id)}
                userName={selectedUser ? selectedUser.name : ''}
                />
            </div>
        </MainLayout>
    );
};

export default UsersPage;
