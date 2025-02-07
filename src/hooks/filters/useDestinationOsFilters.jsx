import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useDestinationOsFilters = (fetchDestinations, filters, setFilters) => {
    const [selectedDestinationsOs, setSelectedDestinationsOs] = useState([]);

    const handleChangeTypes = useCallback((newSelected, column) => {
        setSelectedDestinationsOs((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedDestinationsOs, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedDestinationsOs, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedDestinationsOs, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedDestinationsOs.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchDestinations({
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
                    model="serviceOrderDestination"
                    value={selectedDestinationsOs.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeTypes(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os destinos pelo número"
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
                    model="serviceOrderDestination"
                    value={selectedDestinationsOs.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeTypes(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre os destinos pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedDestinationsOs, handleChangeTypes, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useDestinationOsFilters;
