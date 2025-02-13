import React, { useState } from 'react';
import { useOrgan } from '../hooks/useOrgan';
import { CircularProgress } from '@mui/material';
import '../assets/styles/custom-styles.css'; 
import SideBarTwo from './SideBarTwo';

const MainLayout = ({ children }) => {
    const { loading } = useOrgan();

    return (
        <div id="wrapper" className="d-flex">
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center w-100"
                    style={{ height: '100vh' }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <SideBarTwo children={children}></SideBarTwo>
                </>
            )}
        </div>
    );
};

export default MainLayout;
