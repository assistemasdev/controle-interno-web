import { useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";

export const useApplication = () => {
    return useContext(ApplicationContext);
};