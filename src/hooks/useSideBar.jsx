
import { useContext } from "react";
import { SideBarContext} from "../context/SideBarContext";

export const useSideBar = () => {
    return useContext(SideBarContext);
};
  