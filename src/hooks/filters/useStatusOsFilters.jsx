import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useStatusOsFilters = (fetchStatus, filters, setFilters) => {
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    const handleChangeStatuses = useCallback((newSelected, column) => {
        setSelectedStatuses((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedStatuses, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedStatuses, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedStatuses, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedStatuses.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchStatus({
            id: selectedIds,
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
                    model="serviceOrderStatus"
                    value={selectedStatuses.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeStatuses(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os status pelo número"
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
                    model="serviceOrderStatus"
                    value={selectedStatuses.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeStatuses(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os status pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedStatuses, handleChangeStatuses, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useStatusOsFilters;
