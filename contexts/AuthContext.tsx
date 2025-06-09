import {createContext, useContext, useMemo, useState} from 'react';

const AuthContext = createContext<{
    isAuthenticated: boolean;
    authenticate: () => void;
    logout: () => void;
}>({
    isAuthenticated: false,
    authenticate: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const authenticate = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const value = useMemo(() => ({
        isAuthenticated,
        authenticate,
        logout
    }), [isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
