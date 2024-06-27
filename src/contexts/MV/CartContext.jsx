import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "../../redux/MV/cart/cartSlice";

const CartContext = createContext();

export function CartProvider({ children }) {
  const dispatch = useDispatch();

  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem("cartProducts");
    if (storedProducts) {
      setCartProducts(JSON.parse(storedProducts));
      dispatch(setProducts(JSON.parse(storedProducts)));
    }
  }, []);

  const addToCart = (product) => {
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

    let updatedCartProducts;

    if (vendorIndex !== -1) {
      // Deep clone the vendor to avoid mutating the original state
      const updatedVendor = { ...cartProducts[vendorIndex] };
      const existingProductIndex = updatedVendor.products.findIndex(
        (p) => p.id === essentialProduct.id
      );

      if (existingProductIndex !== -1) {
        updatedVendor.products = updatedVendor.products.map((product, index) =>
          index === existingProductIndex
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        updatedVendor.products = [
          ...updatedVendor.products,
          { ...essentialProduct, quantity: 1 },
        ];
      }

      updatedCartProducts = [
        ...cartProducts.slice(0, vendorIndex),
        updatedVendor,
        ...cartProducts.slice(vendorIndex + 1),
      ];
    } else {
      updatedCartProducts = [
        ...cartProducts,
        { vendor, products: [{ ...essentialProduct, quantity: 1 }] },
      ];
    }

    setCartProducts(updatedCartProducts);
    dispatch(setProducts(updatedCartProducts));
    localStorage.setItem("cartProducts", JSON.stringify(updatedCartProducts));
  };

  const isOrderLimitExceeded = (productId, vendorId) => {
    const vendorObj = cartProducts?.find((v) => v?.vendor?.id === vendorId);
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
      const updatedCartProducts = cartProducts.map((vendor, index) => {
        if (index === vendorIndex) {
          const updatedProducts = vendor.products.map((product) => {
            if (product.id === id) {
              return { ...product, quantity: product.quantity + 1 };
            }
            return product;
          });
          return { ...vendor, products: updatedProducts };
        }
        return vendor;
      });

      setCartProducts(updatedCartProducts);
      dispatch(setProducts(updatedCartProducts));
      localStorage.setItem("cartProducts", JSON.stringify(updatedCartProducts));
    }
  };

  const decrementById = (id, vendorId) => {
    const vendorIndex = cartProducts.findIndex((v) => v.vendor.id === vendorId);

    if (vendorIndex !== -1) {
      const updatedCartProducts = cartProducts.map((vendor, index) => {
        if (index !== vendorIndex) return vendor;

        const updatedProducts = vendor.products
          .map((product) => {
            if (product.id === id) {
              const updatedQuantity = product.quantity - 1;
              return updatedQuantity <= 0
                ? null
                : { ...product, quantity: updatedQuantity };
            }
            return product;
          })
          .filter((product) => product !== null);

        return { ...vendor, products: updatedProducts };
      });

      const finalCartProducts = updatedCartProducts.filter(
        (vendor) => vendor.products.length > 0
      );

      setCartProducts(finalCartProducts);
      dispatch(setProducts(finalCartProducts));
      localStorage.setItem("cartProducts", JSON.stringify(finalCartProducts));
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

      setCartProducts(filteredCartProducts);
      dispatch(setProducts(filteredCartProducts));
      localStorage.setItem(
        "cartProducts",
        JSON.stringify(filteredCartProducts)
      );
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
    setCartProducts([]);
    dispatch(setProducts([]));
    localStorage.removeItem("cartProducts");
  };

  return (
    <CartContext.Provider
      value={{
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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
