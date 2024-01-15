import { useState,createContext } from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({children}) => {

    const [auth, setAuth] = useState();

    const role = {
        admin: 4636,
        user: 4757
    }

    return (
        <AuthContext.Provider value={{auth, setAuth, role}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;