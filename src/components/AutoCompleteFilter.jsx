import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Select from 'react-select';  

const AutoCompleteFilter = ({
    fetchOptions,
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
    const { debouncedFn  } = useDebounce(fetchOptions, 500);

    const handleInputChange = (value) => {
        setInputValue(value);
        if (value) {    
            debouncedFn(value).then((results) => setOptions(results)); 
        } else {
            setOptions([]);
        }
    };
    
    const handleChange = (selected) => {
        setSelectedValue(selected);
        onChange && onChange(selected); 
    };

    const handleBlur = () => {
        if (inputValue && !selectedValue.some((option) => option.label === inputValue)) {
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
            value={selectedValue}
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