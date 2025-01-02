import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutesContent from "./AppRoutesContent";
import { AuthProvider } from "../context/AuthContext";
import { ApplacationProvider } from "../context/ApplicationContext";
import { OrganProvider } from "../context/OrganContext";
import { SideBarProvider } from "../context/SideBarContext";
import { PermissionsProvider } from "../context/PermissionsContext";
import { LoaderProvider } from "../context/LoaderContext"; 
import GlobalLoader from "../components/GlobalLoader"; 

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <PermissionsProvider>
                    <ApplacationProvider>
                        <OrganProvider>
                            <SideBarProvider>
                                <LoaderProvider>
                                    <AppRoutesContent />
                                    <GlobalLoader /> 
                                </LoaderProvider>
                            </SideBarProvider>
                        </OrganProvider>
                    </ApplacationProvider>
                </PermissionsProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
