import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useEquipamentKitsFilters = (fetchTypes, filters, setFilters) => {
    const [selectedKits, setSelectedKits] = useState([]);

    const handleChangeEquipamentKit = useCallback((newSelected, column) => {
        setSelectedKits((prev) => {
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
        
        const selectedKitsIds = buildFilteredArray(selectedKits, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedKits, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedKits, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedKits.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedKitsIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchTypes({
            id: selectedKitsIds,
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
                    model="equipamentKit"
                    value={selectedKits.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeEquipamentKit(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os kits pelo número"
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
                    model="equipamentKit"
                    value={selectedKits.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeEquipamentKit(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os kits pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedKits, handleChangeEquipamentKit, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useEquipamentKitsFilters;
