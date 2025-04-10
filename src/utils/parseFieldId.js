export const parseFieldId = (id) => {
    const parts = id.split('.');
    const prefix = parts.slice(0, -1).join('.');
    const key = parts[parts.length - 1];
    return [prefix, key];
};
