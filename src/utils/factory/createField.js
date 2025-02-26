/**
 * Função fábrica para criar objetos de campos de formulário.
 * 
 * @param {Object} params - Parâmetros para configurar o campo.
 * @param {string} params.id - Identificador único do campo (obrigatório).
 * @param {string} params.label - Rótulo ou nome do campo (obrigatório).
 * @param {string} [params.type="text"] - Tipo do campo (e.g., "text", "email", "password", "select", etc.).
 * @param {string} [params.placeholder=""] - Texto de ajuda que aparece dentro do campo quando ele está vazio.
 * @param {string} [params.value=""] - Valor inicial do campo (opcional).
 * @param {boolean} [params.isMulti=false] - Indica se o campo aceita múltiplos valores (para campos do tipo "select").
 * @param {boolean} [params.fullWidth=false] - Se o campo deve ocupar a largura total disponível no formulário.
 * @param {string} [params.icon=""] - Ícone a ser exibido ao lado do campo, geralmente de uma biblioteca de ícones como FontAwesome.
 * @param {boolean} [params.disabled=false] - Se o campo deve ser desabilitado.
 * @param {string|null} [params.entity=null] - Se o campo está associado a uma entidade (ex: utilizado para autocomplete com dados de uma entidade).
 * @param {string|null} [params.column=null] - Caso o campo esteja relacionado a uma coluna de dados.
 * @param {string|null} [params.columnLabel=null] - Rótulo da coluna relacionada (usado com `column`).
 * @param {string|null} [params.columnDetails=null] - Detalhes da coluna relacionada.
 * @param {boolean} [params.notRequired=false] - Indica se o campo não é obrigatório.
 * @param {boolean} [params.isUnique=false] - Indica se o campo deve ser único, como em um campo de nome de usuário ou e-mail.
 * @param {Array} [params.options=[]] - Lista de opções para campos do tipo "select" ou "multi-select".
 * 
 * @returns {Object} Objeto configurado para o campo do formulário.
 */
const createField = ({
    id,
    label,
    type = "text", 
    placeholder = "",
    value = "", 
    isMulti = false,
    fullWidth = false,
    icon = "",
    disabled = false,
    entity = null,
    column = null,
    columnLabel = null,
    columnDetails = null,
    notRequired = false,
    isUnique = false,
    options = [] 
}) => {
    return {
        id,
        label,
        type,
        placeholder,
        value,
        isMulti,
        fullWidth,
        icon,
        disabled,
        entity,
        column,
        columnLabel,
        columnDetails,
        notRequired,
        isUnique,
        options 
    };
};

export default createField;
