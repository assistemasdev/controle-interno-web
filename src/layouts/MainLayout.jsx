import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import Topbar from './Topbar'; 
import { useOrgan } from '../hooks/useOrgan';
import { CircularProgress } from '@mui/material';
import '../assets/styles/custom-styles.css'; 
import SideBarTwo from './SideBarTwo';

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
                    <SideBarTwo children={children}></SideBarTwo>
                    {/* <Sidebar isVisible={isSidebarVisible} /> */}

                    {/* <div id="content-wrapper" className="main d-flex flex-column w-100">
                        <div id="content" className="flex-grow-1">
                            <Topbar />
                            <div className="container-fluid">
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </div>
    );
};

export default MainLayout;
