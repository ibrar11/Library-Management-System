import { useContext } from "react";
import ViewBookContext from "../context/ViewBookContext";

const useViewBookContext = () => {

    return useContext(ViewBookContext);

};

export default useViewBookContext;