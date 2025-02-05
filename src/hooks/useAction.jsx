import { useState } from 'react';
import useBaseService from './services/useBaseService'; 

const useAction = (navigate) => {
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
    const [action, setAction] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const { del: remove } = useBaseService(navigate);

    const handleActivate = (item, actionText, fetchUsers) => {
        setSelectedItem(item);
        setAction({
            action: 'activate',
            text: actionText,
        });
        setOpenModalConfirmation(true);
    };

    const handleDelete = (item, actionText, deleteUrl, fetchData) => {
        setSelectedItem(item);
        setAction({
            action: 'delete',
            text: actionText,
            deleteUrl,
            fetchData
        });
        setOpenModalConfirmation(true);
    };

    const handleConfirmAction = async () => {
        try {
            if (action.action === 'delete') {
                await remove(action.deleteUrl); 
                action.fetchData();
            } else if (action.action === 'activate') {
            }
            setOpenModalConfirmation(false);
        } catch (error) {
            console.error(error);
            setOpenModalConfirmation(false);
        }
    };

    const handleCancelConfirmation = () => {
        setOpenModalConfirmation(false);
    };

    return {
        openModalConfirmation,
        setOpenModalConfirmation,
        action,
        handleActivate,
        handleDelete,
        handleConfirmAction,
        handleCancelConfirmation,
        selectedItem,
    };
};

export default useAction;
