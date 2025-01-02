import { useContext } from 'react';
import LoaderContext from '../context/LoaderContext';

const useLoader = () => {
    return useContext(LoaderContext);
};

export default useLoader;
