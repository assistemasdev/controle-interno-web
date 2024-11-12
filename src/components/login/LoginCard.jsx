// src/components/login/LoginCard.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth'; 

const LoginCard = () => {
  const navigate = useNavigate();  
  const { login } = useAuth();  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'user@example.com' && password === 'password123') {
      const userData = { email, role: 'Admin', name: 'João Silva' };  
      login(userData); 
      navigate('/dashboard');
    } else {
      setErrorMessage('Credenciais inválidas');
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
                    type="email"
                    id="exampleInputEmail"
                    placeholder="Insira seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
