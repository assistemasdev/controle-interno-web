import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useProductFilters = (fetchProducts, filters, setFilters) => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleChangeProducts = useCallback((newSelected, column) => {
        setSelectedProducts((prev) => {
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
        
        const selectedIds = buildFilteredArray(selectedProducts, 'id', 'numberFilter', false)
        const selectedNumbers = buildFilteredArray(selectedProducts, 'number', 'numberFilter', true)

        const filledInputs = new Set(selectedProducts.map((option) => option.column)).size;
    
        const previousFilters = filters || {};
    
        setFilters(prev => ({
            ...prev,
            id: selectedIds,
            number: selectedNumbers,
            filledInputs,
            page: 1, 
        }));

        fetchProducts({
            id: selectedIds,
            number: selectedNumbers,
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
                    columnDataBase="number"
                    model="product"
                    value={selectedProducts.filter((option) => option.column === "number")}
                    onChange={(selected) => handleChangeProducts(selected, "number")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre os produtos pelo número"
                    isMulti
                />
            ),
        },
    ];

    return { selectedProducts, handleChangeProducts, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useProductFilters;
