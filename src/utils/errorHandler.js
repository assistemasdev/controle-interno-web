const handleError = (error, navigate = null) => {
    if (error.response) {
      console.error("Erro da API:", error.response.data);

      if (error.response.status === 401 && navigate) {
        localStorage.clear();
        navigate('/login', {state: { message: 'Sessão expirada, por favor faça login novamente.'}})
      }

      return {
        success: false,
        message: error.response.data.message || "Erro ao processar a solicitação.",
        status: error.response.status,
        data: null,
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
  