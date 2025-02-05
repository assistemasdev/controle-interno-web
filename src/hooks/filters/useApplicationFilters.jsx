import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useApplicationFilters = (fetchApplications, filters, setFilters) => {
    const [selectedApplications, setSelectedApplications] = useState([]);

    const handleChangeApplications = useCallback((newSelected, column) => {
        setSelectedApplications((prev) => {
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
        const selectedApplicationIds = buildFilteredArray(selectedApplications, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedApplications, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedApplications, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedApplications.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedApplicationIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchApplications({
            id: selectedApplicationIds,
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
                    model="application"
                    value={selectedApplications.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeApplications(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre as aplicações pelo número"
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
                    model="application"
                    value={selectedApplications.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeApplications(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre as aplicações pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedApplications, handleChangeApplications, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useApplicationFilters;
