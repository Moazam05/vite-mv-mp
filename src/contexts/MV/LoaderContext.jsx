import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const useLoaderContext = () => {
    return useContext(LoaderContext);
};

export const LoaderProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);

    const handleLoader = (state) => {
        setLoading(state)
    }

    return (
        <LoaderContext.Provider value={{ loading, handleLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};
