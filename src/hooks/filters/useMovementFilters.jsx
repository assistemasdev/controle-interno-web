import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useMovementsFilters = (fetchMovements, filters, setFilters) => {
    const [selectedMovements, setSelectedMovements] = useState([]);

    const handleChangeMovements = useCallback((newSelected, column) => {
        setSelectedMovements((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedMovements, 'id', 'identifyFilter', false);
        const selectedIdLikes = buildFilteredArray(selectedMovements, 'id', 'identifyFilter', true);
        const filledInputs = new Set(selectedMovements.map((option) => option.column)).size;
        const previousFilters = filters || {}; 

        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
        }));
    
        fetchMovements({
            id: selectedIds,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1,
            deleted_at: previousFilters.deleted_at, 
        });
    };

    const handleClearFilters = () => {
        window.location.reload();
    };

    const inputsfilters = [
        {
            label: "Identificador",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="movement"
                    value={selectedMovements.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeMovements(selected, "id")}
                    onBlurColumn="identifyFilter"
                    placeholder="Filtre os movimentos pelo identificador"
                    isMulti
                />
            ),
        }
    ];

    return { selectedMovements, handleChangeMovements, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useMovementsFilters;
