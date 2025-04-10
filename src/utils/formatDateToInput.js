export const formatDateToInput = (dateString) => {
    const [day, month, year] = dateString.split(" ")[0].split("/");
    return `${year}-${month}-${day}`;
};
