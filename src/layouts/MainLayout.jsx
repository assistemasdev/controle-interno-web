import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar'; 
import { useOrgan } from '../hooks/useOrgan';
import { CircularProgress } from '@mui/material';
import '../assets/styles/custom-styles.css'; 

const MainLayout = ({ children }) => {
    const { loading } = useOrgan();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); 

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
                    <Sidebar isVisible={isSidebarVisible} />

                    <div id="content-wrapper" className="d-flex flex-column w-100">
                        <div id="content" className="flex-grow-1">
                            <Topbar />
                            <div className="container-fluid">
                                {children}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainLayout;
