import { useContext } from "react";
import { OrganContext } from "../context/OrganContext";

export const useOrgan = () => {
    return useContext(OrganContext);
};