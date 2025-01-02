import React from 'react';
import useLoader from '../hooks/useLoader';
import { CircularProgress } from '@mui/material';

const GlobalLoader = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress size={50} />
        </div>
    );
};

export default GlobalLoader;
