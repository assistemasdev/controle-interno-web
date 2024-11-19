import { useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";

export const useCompany = () => {
    return useContext(CompanyContext);
};