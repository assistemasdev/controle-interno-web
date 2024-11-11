import React from 'react';
import InputField from './InputField';
import Button from './Button';

const LoginCard = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login efetuado");
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
                <form className="user" onSubmit={handleLogin}>
                  <InputField
                    type="email"
                    id="exampleInputEmail"
                    placeholder="Insira seu email"
                  />
                  <InputField
                    type="password"
                    id="exampleInputPassword"
                    placeholder="Senha"
                  />
                  <Button
                    text="Login"
                    className="btn btn-outline-info btn-block"
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
