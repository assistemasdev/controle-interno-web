import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useCustomerFilters = (fetchCustomers, filters, setFilters) => {
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const handleChangeCustomers = useCallback((newSelected, column) => {
        setSelectedCustomers((prev) => {
            if (!newSelected.length) {
                return prev.filter((option) => option.column !== column);
            }

            const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
            const filtered = prev.filter((option) => option.column !== column);
            return [...filtered, ...newSelectedArray];
        });
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const selectedCustomerIds = buildFilteredArray(selectedCustomers, 'id', 'numberFilter', false);
        const selectedNames = buildFilteredArray(selectedCustomers, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedCustomers, 'id', 'textFilter', true);
        const filledInputs = new Set(selectedCustomers.map((option) => option.column)).size;
        const previousFilters = filters || {};

        setFilters(prev => ({
            ...prev,
            id: selectedCustomerIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));

        fetchCustomers({
            id: selectedCustomerIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at
        });
    };

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Número",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="customer"
                    value={selectedCustomers.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeCustomers(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os clientes pelo número"
                    isMulti
                />
            ),
        },
        {
            label: "Nome",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="name"
                    model="customer"
                    value={selectedCustomers.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeCustomers(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os clientes pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedCustomers, handleChangeCustomers, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useCustomerFilters;
