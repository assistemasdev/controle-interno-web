import { useEffect, useState } from "react";
import Select from "react-select";
import baseService from "../services/baseService";
import useLoader from "../hooks/useLoader";
import useDebounce from "../hooks/useDebounce";

const AutoCompleteInput = ({ 
    entity, 
    column, 
    columnLabel, 
    columnDetails,
    onChange = {}, 
    placeholder = "Digite algo...", 
    isMulti = false, 
    value,
    exclude_ids
}) => {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const { debouncedFn } = useDebounce(fetchOptions, 500);
    const [fetchedLabels, setFetchedLabels] = useState({});
    const { showLoader, hideLoader } = useLoader();

    async function fetchOptions(inputValue) {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        try {
            const response = await baseService.autocomplete(entity, { [column]: inputValue, exclude_ids });
            setOptions(response.result.map((item) => ({
                value: item.id,
                label: item[columnLabel] + (item[columnDetails] ? ' - ' + item[columnDetails] : '')
            })));
        } catch (error) {
            console.error("Erro ao buscar opções:", error);
            setOptions([]);
        }
    }

    const handleInputChange = (value) => {
        setInputValue(value);
        debouncedFn(value); 
    };

    const handleChange = (selectedOption) => {
        setInputValue(selectedOption ? selectedOption.label : "");

        if (onChange) {
            onChange(selectedOption);
        }
    };

    const getLabelByValue = (value) => {
        if (Array.isArray(value)) {
            const selected = value.find(opt => opt.value === value);
            return selected ? selected.label : '';
        }

        if (value && value.value === value) {
            return value.label;
        }

        return '';
    };

    const fetchLabelsByIds = async (ids) => {
        const idsToFetch = ids.filter(id => !fetchedLabels[id]); 
    
        if (idsToFetch.length === 0) return; 
    
        try {
            showLoader();
            const response = await baseService.autocomplete(entity, { id: idsToFetch, exclude_ids });
            const newLabels = {};
    
            response.result.forEach(item => {
                newLabels[item.id] = item[columnLabel] + (item[columnDetails] ? ' - ' + item[columnDetails] : '');
            });
    
            setFetchedLabels(prev => ({ ...prev, ...newLabels }));

            if (isMulti) {
                value = ids.map(id => ({
                        value: id,
                        label: newLabels[id] || fetchedLabels[id] || 'Carregando...'
                    }))
                    .concat(
                        Object.keys(fetchedLabels).map(id => ({
                            value: id,
                            label: fetchedLabels[id] || 'Carregando...'
                        }))
                    );
            } else {
                value = {
                    value: ids[0],
                    label: newLabels[ids[0]] || fetchedLabels[ids[0]] || 'Carregando...'
                };
            }
        } catch (error) {
            console.error("Erro ao buscar labels:", error);
        } finally {
            hideLoader();
        }
    };

    // useEffect(() => {
    //     if (value) {
    //         const ids = Array.isArray(value) ? value : [value];
    //         const idsToFetch = ids.filter(id => !fetchedLabels[id]); 
            
    //         if (idsToFetch.length > 0) {
    //             fetchLabelsByIds(idsToFetch);
    //         }
    //     }
    // }, [value, fetchedLabels]);

    // useEffect(() => {
    //     if (value) {
    //         if (Array.isArray(value)) {
    //             value = value.map((selected) => ({
    //                 ...selected,
    //                 label: getLabelByValue(selected.value)
    //             }));
    //         } else {
    //             value = {
    //                 value: value.value,
    //                 label: getLabelByValue(value.value)
    //             };
    //         }
    //     } else {
    //         value = null;
    //     }
    // }, [value]);

    useEffect(() => {
        console.log(value)
    }, [value])
    
    return (
        <Select
            options={options}
            value={value}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isMulti={isMulti}
            placeholder={placeholder}
            noOptionsMessage={() => "Nenhuma opção encontrada"}
        />
    );
};

export default AutoCompleteInput;
