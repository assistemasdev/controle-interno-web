import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useGroupsFilters = (fetchTypes, filters, setFilters) => {
    const [selectedGroups, setSelectedGroups] = useState([]);

    const handleChangeGroups = useCallback((newSelected, column) => {
        setSelectedGroups((prev) => {
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
        
        const selectedGroupsIds = buildFilteredArray(selectedGroups, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedGroups, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedGroups, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedGroups.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedGroupsIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchTypes({
            id: selectedGroupsIds,
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
                    model="group"
                    value={selectedGroups.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeGroups(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os grupos pelo número"
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
                    model="group"
                    value={selectedGroups.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeGroups(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os grupos pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedGroups, handleChangeGroups, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useGroupsFilters;
