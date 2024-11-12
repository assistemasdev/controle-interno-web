// src/components/login/LoginCard.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; 
import api from '../../services/api';

const LoginCard = () => {
  const navigate = useNavigate();  
  const { login } = useAuth();  

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { username, password });
      if (response.data && response.data.access_token) {
        const token = response.data.access_token; 
        login(token);
        // navigate('/dashboard');
      } else {
        setErrorMessage('Credenciais inválidas');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao realizar o login');
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
                  <h1 className="h4 text-gray-900 mb-4">Bem Vindo!</h1>
                </div>

                {errorMessage && <div className="text-danger text-center">{errorMessage}</div>}

                <form className="user" onSubmit={handleLogin}>
                  <InputField
                    type="text"
                    id="exampleInputUsername"
                    placeholder="Insira seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <InputField
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
