import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutesContent from "./AppRoutesContent";
import { AuthProvider } from "../context/AuthContext";
import { ApplacationProvider } from "../context/ApplicationContext";
import { OrganProvider } from "../context/OrganContext";
import { SideBarProvider } from "../context/SideBarContext";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <ApplacationProvider>
          <OrganProvider>
            <SideBarProvider>
              <AppRoutesContent />
            </SideBarProvider>
          </OrganProvider>
        </ApplacationProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
