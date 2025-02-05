import { useState } from "react";
import AutoCompleteFilter from "../../components/AutoCompleteFilter";
import baseService from "../../services/baseService";
import { buildFilteredArray } from "../../utils/arrayUtils";

export const useUserFilters = (fetchData, filters, setFilters) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleChangeUsers = (newSelected, column) => {
        setSelectedUsers((prev) => {
        if (!newSelected.length) {
            return prev.filter((option) => option.column !== column);
        }

        const newSelectedArray = Array.isArray(newSelected) ? newSelected : [newSelected];
        const filtered = prev.filter((option) => option.column !== column);
        return [...filtered, ...newSelectedArray];
        });
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const selectedUserIds = buildFilteredArray(selectedUsers, 'id', 'textFilter', false);
        const selectedNames = buildFilteredArray(selectedUsers, 'name', 'textFilter', true);
        const selectedIdLikes = buildFilteredArray(selectedUsers, 'id', 'numberFilter', true);
        const filledInputs = new Set(selectedUsers.map((option) => option.column)).size;
        const previousFilters = filters || {}; 
        
        setFilters(prev => ({
            ...prev,
            id: selectedUserIds,
            name: selectedNames,
            idLike: selectedIdLikes,
            filledInputs,
            page: 1
        }));
    
        fetchData({
            id: selectedUserIds,
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
            model="user"
            value={selectedUsers.filter((option) => option.column === "id")}
            onChange={(selected) => handleChangeUsers(selected, "id")}
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
            model="user"
            value={selectedUsers.filter((option) => option.column === "name")}
            onChange={(selected) => handleChangeUsers(selected, "name")}
            onBlurColumn="textFilter"
            placeholder="Filtre os tipos pelo nome"
            isMulti
            />
        ),
        },
    ];

    return { selectedUsers, handleChangeUsers, handleFilterSubmit, handleClearFilters, inputsfilters };
};
