import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useMovementsTypesFilters = (fetchTypes, filters, setFilters) => {
    const [selectedMovementsTypes, setSelectedMovementsTypes] = useState([]);

    const handleChangeTypes = useCallback((newSelected, column) => {
        setSelectedMovementsTypes((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedMovementsTypes, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedMovementsTypes, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedMovementsTypes, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedMovementsTypes.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchTypes({
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
                    model="movementType"
                    value={selectedMovementsTypes.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeTypes(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os tipos pelo número"
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
                    model="movementType"
                    value={selectedMovementsTypes.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeTypes(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os tipos pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedMovementsTypes, handleChangeTypes, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useMovementsTypesFilters;
