import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../../interfaces/product.interface";

interface State {
    cart: CartProduct[];

    addProductTocart: (product: CartProduct) => void;
    getTotalItems: () => number;
    getSummaryInformation: () => {
            subTotal: number;
            tax: number;
            total: number;
            itemsInCart: number;
    };
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],

            //Methods

            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },

            getSummaryInformation: () => {
                const { cart } = get();
                const subTotal = cart.reduce(
                    (subTotal, product) =>
                        product.quantity * product.normal_price + subTotal,
                    0
                );

                const tax = subTotal * 0.07;
                const total = tax + subTotal;
                const itemsInCart = cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                );

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart,
                };
            },

            addProductTocart: (product: CartProduct) => {
                const { cart } = get();

                // 1. Revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) =>
                        item.id === product.id &&
                        item.variant?.attributes === product.variant?.attributes
                );

                if (!productInCart) {
                    set({ cart: [...cart, product] });
                    return;
                }

                // 2. Se que el producto existe por talla... tengo que incrementar
                const updatedCartProducts = cart.map((item) => {
                    if (
                        item.id === product.id &&
                        item.variant?.attributes === product.variant?.attributes
                    ) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity,
                        };
                    }

                    return item;
                });

                set({ cart: updatedCartProducts });
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map((item) => {
                    if (
                        item.id === product.id &&
                        item.variant?.attributes === product.variant?.attributes
                    ) {
                        return { ...item, quantity: quantity };
                    }
                    return item;
                });
                set({ cart: updatedCartProducts });
            },

            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter(
                    (item) =>
                        item.id !== product.id ||
                        item.variant?.attributes !== product.variant?.attributes
                );

                set({ cart: updatedCartProducts });
            },
        }),

        {
            name: "shopping-cart",
        }
    )
);
