"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {
    const updateProductQuantity = useCartStore(
        (state) => state.updateProductQuantity
    );
    const removeProduct = useCartStore((state) => state.removeProduct);

    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore((state) => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <p>Cargando productos..</p>;
    }

    return (
        <>
            {productsInCart.map((product) => (
                <div
                    key={`${product.id}-${
                        product.variant
                            ? JSON.stringify(
                                  product.variant.attributes,
                                  Object.keys(product.variant.attributes).sort()
                              )
                            : ""
                    }`}
                    className="flex mb-5"
                >
                    <Image
                        src={`/products/${product.image}`}
                        width={100}
                        height={100}
                        style={{
                            width: "100px",
                            height: "100px",
                        }}
                        alt={product.title}
                        className="mr-5 rounded"
                    />

                    <div>
                        <span>
                            {product.title}
                            <p className="text-sm">
                                {product.variant
                                    ? Object.entries(product.variant.attributes)
                                          .map(
                                              ([key, value]) =>
                                                  `${key} ${value}`
                                          )
                                          .join(", ")
                                    : ""}
                            </p>
                            <p className="text-sm">
                                Cant: {product.quantity}, Precio:{" "}
                                {currencyFormat(product.normal_price)}
                            </p>
                        </span>

                        <p className="font-bold">
                            Total:{" "}
                            {currencyFormat(
                                product.normal_price * product.quantity
                            )}
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
};
