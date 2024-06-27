import { ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import RootComponent from "./Router";
import theme from "./constants/MV/theme";
import cacheRtl from "./constants/MV/cache";
import { CartProvider } from "./contexts/MV/CartContext";
import { LanguageProvider } from "./contexts/MV/LanguageContext";
import { ToastContainer } from "react-toastify";
import { LoaderProvider } from "./contexts/MV/LoaderContext";
import { QuoteProvider } from "./contexts/MV/QouteContext";

function App() {
  return (
    <LoaderProvider>
      <CacheProvider value={cacheRtl}>
        <LanguageProvider>
          <CartProvider>
            <QuoteProvider>
              <ThemeProvider theme={theme}>
                <ToastContainer hideProgressBar={true} autoClose={2000} />
                <RootComponent />
              </ThemeProvider>
            </QuoteProvider>
          </CartProvider>
        </LanguageProvider>
      </CacheProvider>
    </LoaderProvider>
  );
}

export default App;
