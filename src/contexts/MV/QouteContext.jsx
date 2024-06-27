import { createContext, useContext, useEffect, useState } from "react";

const QouteContext = createContext();

export function QuoteProvider({ children }) {
  const [qouteCount, setQouteCount] = useState(0);
  const [qouteProducts, setqouteProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("qouteProducts");
    const storedCount = localStorage.getItem("qouteCount");
    if (storedProducts) {
      setqouteProducts(JSON.parse(storedProducts));
    }
    if (storedCount) {
      setQouteCount(parseInt(storedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("qouteProducts", JSON.stringify(qouteProducts));
    localStorage.setItem("qouteCount", qouteCount.toString());
  }, [qouteProducts, qouteCount]);

  const addToQoute = (product) => {
    setQouteCount(qouteCount + 1);

    // Check if the product already exists in the cart
    const existingProduct = qouteProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      // If the product exists, update its quantity
      const updatedqouteProducts = qouteProducts.map((p) => {
        if (p.id === product.id) {
          return { ...p, quantity: p.quantity + 1 };
        }
        return p;
      });
      setqouteProducts(updatedqouteProducts);
    } else {
      // If the product doesn't exist, add it to the cart with quantity 1
      setqouteProducts([...qouteProducts, { ...product, quantity: 1 }]);
    }
  };

  const incrementByQouteId = (id) => {
    const updatedqouteProducts = qouteProducts.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    });

    setqouteProducts(updatedqouteProducts);
  };

  const decrementByQouteId = (id) => {
    const updatedqouteProducts = qouteProducts
      .map((product) => {
        if (product.id === id) {
          const updatedQuantity = product.quantity - 1;
          // Check if quantity becomes zero or negative, and remove the item
          if (updatedQuantity <= 0) {
            return null; // Return null to filter out this item
          } else {
            return { ...product, quantity: updatedQuantity };
          }
        }
        return product;
      })
      .filter((product) => product !== null); // Remove null values

    setqouteProducts(updatedqouteProducts);
  };

  const removeFromQoute = (id) => {
    const updatedqouteProducts = qouteProducts.filter(
      (product) => product.id !== id
    );

    // Calculate the new cart count by summing the quantities of remaining products
    const newQouteCount = updatedqouteProducts.reduce(
      (total, product) => total + product.quantity,
      0
    );

    setQouteCount(newQouteCount);
    setqouteProducts(updatedqouteProducts);
  };

  const calculateTotalQoutePrice = () => {
    const totalPrice = qouteProducts.reduce((total, product) => {
      const { quantity, vat_onlinePrice } = product;
      return total + quantity * vat_onlinePrice;
    }, 0);

    return totalPrice;
  };

  const emptyQoute = () => {
    setQouteCount(0);
    setqouteProducts([]);

    localStorage.removeItem("qouteProducts");
    localStorage.removeItem("qouteCount");
  };

  return (
    <QouteContext.Provider
      value={{
        qouteCount,
        qouteProducts,
        addToQoute,
        incrementByQouteId,
        decrementByQouteId,
        removeFromQoute,
        calculateTotalQoutePrice,
        emptyQoute,
      }}
    >
      {children}
    </QouteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQoute() {
  return useContext(QouteContext);
}
