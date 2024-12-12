export const maskCpf = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11); 
    return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCnpj = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 14); 
    return numericValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,4})/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskCpfCnpj = (value) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length <= 11) {
        return maskCpf(value); 
    } else {
        return maskCnpj(value);
    }
};

export const maskCep = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 8);
    return numericValue.replace(/(\d{5})(\d{1,3})/, '$1-$2');
};

export const maskPhone = (value) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 11); 
    return numericValue.length <= 10
        ? numericValue.replace(/(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3') 
        : numericValue.replace(/(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3'); 
};


export const removeMask = (value) => {
    if (typeof value === 'string') {
        return value.replace(/\D/g, '');
    }
    return value || ''; 
};