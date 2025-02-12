import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useShiptmentFilters = (fetchProducts, filters, setFilters) => {
    const [selectedShipments, setSelectedShipments] = useState([]);

    const handleChangeShipments = useCallback((newSelected, column) => {
        setSelectedShipments((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedShipments, 'id', 'numberFilter', false)
        const selectedIdsLikes = buildFilteredArray(selectedShipments, 'id', 'numberFilter', true)

        const filledInputs = new Set(selectedShipments.map((option) => option.column)).size;
    
        const previousFilters = filters || {};
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            idLike: selectedIdsLikes,
            filledInputs,
            page: 1, 
        }));

        fetchProducts({
            id: selectedIds,
            idLike: selectedIdsLikes,
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
            label: "Número",
            component: (
                <AutoCompleteFilter
                    service={baseService}
                    columnDataBase="id"
                    model="shipment"
                    value={selectedShipments.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeShipments(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os carregamentos pelo número"
                    isMulti
                />
            ),
        },
    ];

    return { selectedShipments, handleChangeShipments, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useShiptmentFilters;
