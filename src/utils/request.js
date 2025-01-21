import api from "../services/api";
import handleError from "./errorHandler";
import { formatResponse } from "./objectUtils";

/**
 * Função global para realizar requisições à API.
 *
 * @param {string} method - Método HTTP (get, post, put, delete).
 * @param {string} url - Endpoint da API.
 * @param {object} [data={}] - Dados ou parâmetros para a requisição.
 * @param {function|null} [navigate=null] - Função para redirecionamento em caso de erro (opcional).
 * @returns {Promise<object>} - Resposta formatada da API ou erro tratado.
 */
export default async function request(method, url, data = {}, navigate = null) {
    try {
        const config = method === "get" ? { params: data } : data;
        const response = await api[method](url, config);
        return formatResponse(response.data.message, response.status, response.data.result);
    } catch (error) {
        return handleError(error, navigate);
    }
}
