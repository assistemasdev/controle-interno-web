import { useState, useCallback } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

const useCategoryFilters = (fetchCategories, filters, setFilters) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleChangeCategories = useCallback((newSelected, column) => {
        setSelectedCategories((prev) => {
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
        
        const selectedCatIds = buildFilteredArray(selectedCategories, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedCategories, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedCategories, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedCategories.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedCatIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchCategories({
            id: selectedCatIds,
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
                    model="category"
                    value={selectedCategories.filter((option) => option.column === "id")}
                    onChange={(selected) => handleChangeCategories(selected, "id")}
                    onBlurColumn="numberFilter"
                    placeholder="Filtre as categorias pelo número"
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
                    model="category"
                    value={selectedCategories.filter((option) => option.column === "name")}
                    onChange={(selected) => handleChangeCategories(selected, "name")}
                    onBlurColumn="textFilter"
                    placeholder="Filtre as categorias pelo nome"
                    isMulti
                />
            ),
        },
    ];

    return { selectedCategories, handleChangeCategories, handleFilterSubmit, handleClearFilters, inputsfilters };
};

export default useCategoryFilters;
