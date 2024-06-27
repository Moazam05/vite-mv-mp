import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("cartProducts");
    const storedCount = localStorage.getItem("cartCount");
    if (storedProducts) {
      setCartProducts(JSON.parse(storedProducts));
    }
    if (storedCount) {
      setCartCount(parseInt(storedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    localStorage.setItem("cartCount", cartCount.toString());
  }, [cartProducts, cartCount]);

  const addToCart = (product) => {
    setCartCount(cartCount + 1);

    // Extract essential product keys
    const essentialProduct = {
      id: product.id,
      nameAr: product.commons.ar.productName,
      nameEn: product.commons.en.productName,
      discountedPrice: product.discounted_price,
      vatOnlinePrice: product.vat_onlinePrice,
      image: product.images[0].image,
      orderLimit: product.orderLimit,
      minQty: product.minQty,
      vendorId: product.user_profile.id,
    };

    const vendor = {
      id: product.user_profile.id,
      name: product.user_profile.company_name,
      profile: product.user_profile.slug,
    };

    const vendorIndex = cartProducts.findIndex(
      (v) => v.vendor.id === vendor.id
    );

    if (vendorIndex !== -1) {
      const vendor = cartProducts[vendorIndex];
      const existingProductIndex = vendor.products.findIndex(
        (p) => p.id === essentialProduct.id
      );

      if (existingProductIndex !== -1) {
        vendor.products[existingProductIndex].quantity += 1;
      } else {
        vendor.products.push({ ...essentialProduct, quantity: 1 });
      }

      const updatedCartProducts = [...cartProducts];
      updatedCartProducts[vendorIndex] = vendor;
      setCartProducts(updatedCartProducts);
    } else {
      setCartProducts([
        ...cartProducts,
        { vendor, products: [{ ...essentialProduct, quantity: 1 }] },
      ]);
    }
  };

  const isOrderLimitExceeded = (productId, vendorId) => {
    const vendorObj = cartProducts.find((v) => v.vendor.id === vendorId);
    if (vendorObj) {
      const product = vendorObj.products.find((p) => p.id === productId);
      if (
        product &&
        product.orderLimit &&
        product.quantity >= product.orderLimit
      ) {
        return true;
      }
    }
    return false;
  };

  const incrementById = (id, vendorId) => {
    const vendorIndex = cartProducts.findIndex((v) => v.vendor.id === vendorId);
    if (vendorIndex !== -1) {
      const updatedCartProducts = [...cartProducts];
      const productIndex = updatedCartProducts[vendorIndex].products.findIndex(
        (p) => p.id === id
      );

      if (productIndex !== -1) {
        updatedCartProducts[vendorIndex].products[productIndex].quantity += 1;
        setCartProducts(updatedCartProducts);
      }
    }
  };

  const decrementById = (id, vendorId) => {
    const vendorIndex = cartProducts.findIndex((v) => v.vendor.id === vendorId);
    if (vendorIndex !== -1) {
      const updatedCartProducts = [...cartProducts];
      const updatedVendor = {
        ...updatedCartProducts[vendorIndex],
        products: updatedCartProducts[vendorIndex].products
          .map((product) => {
            if (product.id === id) {
              const updatedQuantity = product.quantity - 1;
              if (updatedQuantity <= 0) {
                return null; // Remove the product if quantity is zero
              } else {
                return { ...product, quantity: updatedQuantity };
              }
            }
            return product;
          })
          .filter((product) => product !== null),
      };

      updatedCartProducts[vendorIndex] = updatedVendor;
      setCartProducts(updatedCartProducts);

      // Optionally, remove the vendor after state update (if state management allows)
      if (updatedVendor.products.length === 0) {
        removeFromCart(id, vendorId); // Call removeFromCart after state update
      }
    }
  };

  const removeFromCart = (id, vendorId) => {
    // Find the index of the vendor in cartProducts
    const vendorIndex = cartProducts.findIndex((v) => v.vendor.id === vendorId);

    if (vendorIndex !== -1) {
      const updatedCartProducts = cartProducts.map((vendor) => {
        if (vendor.vendor.id === vendorId) {
          // Remove the product from the vendor's products array
          vendor.products = vendor.products.filter(
            (product) => product.id !== id
          );
        }
        return vendor;
      });

      // Remove vendors whose products array is empty
      const filteredCartProducts = updatedCartProducts.filter(
        (vendor) => vendor.products.length > 0
      );

      // Update cart count based on remaining products
      const newCartCount = filteredCartProducts.reduce(
        (total, vendor) =>
          total +
          vendor.products.reduce((sum, product) => sum + product.quantity, 0),
        0
      );

      setCartCount(newCartCount);
      setCartProducts(filteredCartProducts);
    }
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartProducts.reduce((total, vendor) => {
      return (
        total +
        vendor.products.reduce((vendorTotal, product) => {
          const { quantity, vatOnlinePrice } = product;
          return vendorTotal + quantity * vatOnlinePrice;
        }, 0)
      );
    }, 0);

    return totalPrice;
  };

  const getTotalCartCount = () => {
    return cartProducts.reduce(
      (total, vendor) =>
        total +
        vendor.products.reduce((sum, product) => sum + product.quantity, 0),
      0
    );
  };

  const emptyCart = () => {
    setCartCount(0);
    setCartProducts([]);

    localStorage.removeItem("cartProducts");
    localStorage.removeItem("cartCount");
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartProducts,
        addToCart,
        incrementById,
        isOrderLimitExceeded,
        decrementById,
        removeFromCart,
        calculateTotalPrice,
        getTotalCartCount,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
