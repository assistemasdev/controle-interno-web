const handleError = (error, navigate = null) => {
    console.log(error)
    if (error.response) {
      console.log(error)
      console.error("Erro da API:", error.response.data);

      if (error.response.status === 401 && navigate) {
        localStorage.clear();
        document.documentElement.style.setProperty('--primary-color','#4da8ff');
        navigate('/login', {state: { message: 'Usuário não autenticado.'}})
      }

      if (error.response.status === 403 && navigate) {
        navigate('/dashboard', {state: { message: error.response.data.message}})
      }
      
      return {
        success: false,
        message: error.response.data.message || "Erro ao processar a solicitação.",
        status: error.response.status,
        data: error.response.data.errors,
      };
    } else if (error.request) {
      console.error("Sem resposta do servidor:", error.request);

      return {
        success: false,
        message: "Sem resposta do servidor. Verifique sua conexão.",
        status: null,
        data: null,
      };
    } else {
      console.error("Erro desconhecido:", error.message);

      return {
        success: false,
        message: error.message || "Erro desconhecido ocorreu.",
        status: null,
        data: null,
      };
    }
  };
  
  export default handleError;
  