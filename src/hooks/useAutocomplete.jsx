import { useNavigate } from 'react-router-dom';
import { removeDuplicatesWithPriority } from '../utils/arrayUtils';

const useAutocomplete = () => {
    const navigate = useNavigate();

    const autoCompleteFunction = async (service, object) => {
        try {
            const [column, value, onBlurColumn] = Object.values(object);
            const response = await service.autocomplete({[column]: value}, navigate)
            const filteredArray = removeDuplicatesWithPriority(
                [
                    {
                        column,
                        [onBlurColumn]: true,
                        label: value,
                        value: value
                    },
                    ...response.result.map((option) => ({
                        column,
                        [onBlurColumn]: false,
                        label:option[column],
                        value: option.id
                    }))
        
                ],
                'label',
                onBlurColumn
            );
    
            return filteredArray
        } catch (error) {
            const readableError = {
                message: error.response?.data?.message || 'Erro desconhecido.',
                status: error.response?.status || 500,
            };

            throw readableError;
        }
    }

    return {autoCompleteFunction};
    
}

export default useAutocomplete;