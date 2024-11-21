import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; 
import MyAlert from '../MyAlert';  
import api from '../../services/api';

const LoginCard = () => {
  const navigate = useNavigate();  
  const { login } = useAuth();  

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({ username: '', password: '' }); 
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setFormErrors({ username: '', password: '' });

    try {
      const response = await api.post('/login', { username, password });
      if (response.data && response.data.access_token) {
        const token = response.data.access_token; 
        login(token);
        setSuccessMessage('Login realizado com sucesso!');
        navigate('/aplicacoes');  
      } else {
        setErrorMessage('Credenciais inválidas');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setFormErrors({
          username: errors?.username ? errors.username[0] : '',
          password: errors?.password ? errors.password[0] : '',
        });
      } else {
        setErrorMessage(error.response?.data?.error || 'Erro ao realizar o login');
      }
    }
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-8">
      <div className="card o-hidden border-0 shadow-lg">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h2 font-color-blue-light mb-4">Bem vindo!</h1>
                </div>

                <form className="user" onSubmit={handleLogin}>
                  {errorMessage && <MyAlert severity="error" message={errorMessage} onClose={() => setErrorMessage('')} />}
                  {successMessage && <MyAlert severity="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

                  <InputField
                    type="text"
                    id="exampleInputUsername"
                    placeholder="Insira seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={formErrors.username}
                  />
                  <InputField
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password} 
                  />
                  <Button
                    text="Login"
                    className="btn btn-outline-info btn-block"
                    link={null}
                  />
                  <hr />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
