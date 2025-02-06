import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useUnitFilters = (fetchUnits, filters, setFilters) => {
    const [selectedUnits, setSelectedUnits] = useState([]);

    const handleChangeUnits = useCallback((newSelected, column) => {
        setSelectedUnits((prev) => {
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
        
        const selectedUnitsIds = buildFilteredArray(selectedUnits, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedUnits, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedUnits, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedUnits.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedUnitsIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchUnits({
            id: selectedUnitsIds,
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
                    model="type"
                    value={selectedUnits.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeUnits(selected, "id")}
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
                    model="type"
                    value={selectedUnits.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeUnits(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os tipos pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedUnits, handleChangeUnits, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useUnitFilters;
