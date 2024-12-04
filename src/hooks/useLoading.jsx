
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export const useLoading = () => {
    return useContext(LoadingContext);
};
  