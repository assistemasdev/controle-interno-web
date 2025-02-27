const handleError = (error, navigate = null) => {
    console.log("Erro capturado:", error);

    if (error.response) {
        console.error("Erro da API:", error.response.data);

        const status = error.response.status;

        if (status === 401) {
            localStorage.clear();
            navigate('/login', { state: { message: 'Usuário não autenticado.' } });
        } else if (status === 403) {
            navigate('/dashboard', { state: { message: error.response.data.message || 'Acesso negado.' } });
        } else if (status === 404) {
            navigate('/404', { state: { message: 'Recurso não encontrado.' } });
        } else if (status === 400) {
            console.log(error)
            throw {
                success: false,
                message: error.response.data.message,
                status,
                data: error.response.data.errors || null,
            };
        } else if (status === 422) {
            const errorObject = Object.entries(error.response.data.errors).reduce((acc, [key, value]) => {
                acc[key] = value[0];
                return acc;
            }, {});

            throw {
                success: false,
                message: "Erro de validação.",
                status,
                data: errorObject || null,
            };
        } else {
            throw {
                success: false,
                message: "Erro ao processar a solicitação.",
                status,
                data: error.response.data.errors || null,
            };
        }
    } else if (error.request) {
        console.error("Sem resposta do servidor:", error.request);
        throw { success: false, message: "Sem resposta do servidor." };
    } else {
        console.error("Erro desconhecido:", error.message);
        throw { success: false, message: "Erro desconhecido." };
    }
};

export default handleError;
  