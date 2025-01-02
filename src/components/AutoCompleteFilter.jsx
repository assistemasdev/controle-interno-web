import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Select from 'react-select';  
import useAutocomplete from "../hooks/useAutocomplete";
import useScanDetection from 'use-scan-detection';

const AutoCompleteFilter = ({
    value,
    service,
    columnDataBase,
    onChange,
    onBlurColumn,
    onFocus,
    placeholder,
    isMulti = false,
    isClearable = true,
    noOptionsMessage = () => "Nenhuma opção encontrada"
}) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedValue, setSelectedValue] = useState([]);
    const { autoCompleteFunction } = useAutocomplete();
    const { debouncedFn  } = useDebounce(autoCompleteFunction, 500);
    const handleInputChange = (value) => {
        setInputValue(value);
        if (value) {    
            debouncedFn(service, {columnDataBase, value, onBlurColumn}).then((results) => {console.log(results); setOptions(results)}); 
        } else {
            setOptions([]);
        }
    };
    
    const handleChange = (selected) => {
        const updatedValue = selected || [];
    
        setSelectedValue(updatedValue);
    
        if (onChange) {
            onChange(updatedValue, columnDataBase); 
        }
    
    };

    useScanDetection({
        onComplete: (scannedValue) => {
            if (!selectedValue.some((item) => item.value === scannedValue)) {
                const newItem = { column: columnDataBase, [onBlurColumn]: true,value: scannedValue, label: scannedValue };
                const updatedValues = [...selectedValue, newItem];
                
                setSelectedValue(updatedValues);
                if (onChange) {
                    onChange(updatedValues, columnDataBase);
                }
            }
            setInputValue('');
        },
        minLength: 5, 
        endChar: '[Enter]', 
    });

    const handleBlur = () => {
        if (inputValue && !selectedValue.some((option) => option.label == inputValue)) {
            setSelectedValue([
                ...selectedValue,
                { [onBlurColumn]: true, value: inputValue, label: inputValue },
            ]);
        }
    
        setOptions([]); 
        setInputValue(""); 
    };

    return (
        <Select
            isMulti={isMulti}
            options={options}
            isClearable={isClearable}
            value={value}
            inputValue={inputValue}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onBlur={handleBlur}         
            onFocus={onFocus}       
            noOptionsMessage={noOptionsMessage}
            placeholder={placeholder}
        />
    );
}

export default AutoCompleteFilter;