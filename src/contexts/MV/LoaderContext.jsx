import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLoaderContext = () => {
  return useContext(LoaderContext);
};

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const handleLoader = (state) => {
    setLoading(state);
  };

  return (
    <LoaderContext.Provider value={{ loading, handleLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
