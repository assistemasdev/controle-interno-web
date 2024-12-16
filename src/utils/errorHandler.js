const handleError = (error, navigate = null) => {
    if (error.response) {
        console.log(error);
        console.error("Erro da API:", error.response.data);

        if (error.response.status === 401 && navigate) {
            localStorage.clear();
            document.documentElement.style.setProperty('--primary-color', '#4da8ff');
            navigate('/login', { state: { message: 'Usuário não autenticado.' } });
        }

        if (error.response.status === 403 && navigate) {
            navigate('/dashboard', { state: { message: error.response.data.message } });
        }
        
        const customError = {
            success: false,
            message: error.response.data.message || "Erro ao processar a solicitação.",
            status: error.response.status,
            data: error.response.data.errors,
        };
        throw customError; 
    } else if (error.request) {
        console.error("Sem resposta do servidor:", error.request);

        const customError = {
            success: false,
            message: "Sem resposta do servidor. Verifique sua conexão.",
            status: null,
            data: null,
        };
        throw customError; 
    } else {
        console.error("Erro desconhecido:", error.message);

        const customError = {
            success: false,
            message: error.message || "Erro desconhecido ocorreu.",
            status: null,
            data: null,
        };
        throw customError; 
    }
};

export default handleError;
  