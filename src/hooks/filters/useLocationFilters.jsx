import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useLocationFilters = (fetchLocations, filters, setFilters) => {
    const [selectedLocations, setSelectedLocations] = useState([]);

    const handleChangeLocations = useCallback((newSelected, column) => {
        setSelectedLocations((prev) => {
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
        const selectedLocationsIds = buildFilteredArray(selectedLocations, 'id', 'numberFilter', false);
        const selectedAreas = buildFilteredArray(selectedLocations, 'area', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedLocations, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedLocations.map((option) => option.column)).size;
        const previousFilters = filters || {};
        
        setFilters(prev => ({
            ...prev,
            id: selectedLocationsIds,
            area: selectedAreas,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));

        fetchLocations({
            id: selectedLocationsIds,
            area: selectedAreas,
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
                    model="location"
                    value={selectedLocations.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeLocations(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre as localizações pelo número"
                    isMulti
                />
            ),
        },
        {
            label: "Área",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="area"
                    model="location"
                    value={selectedLocations.filter((option) => option.column === "area")}
                    onChange={(selected) => handleChangeLocations(selected, "area")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre as localizações pela área"
                    isMulti
                />
            ),
        },
    ];

    return { selectedLocations, handleChangeLocations, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useLocationFilters;
