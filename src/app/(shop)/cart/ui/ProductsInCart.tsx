"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import { QuantitySelector } from "@/components";
import { useState, useEffect } from "react";
import Link from "next/link";

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
                        <Link
                            className="hover:underline cursor-pointer"
                            href={`/product/${product.slug}`}
                        >
                            {product.title}
                            <p className="text-sm">
                                {product.variant
                                    ? Object.entries(product.variant.attributes)
                                          .map(
                                              ([key, value]) =>
                                                  `${key}: ${value}`
                                          )
                                          .join(", ")
                                    : ""}
                            </p>
                        </Link>
                        <p><span>Cantidad: </span>{product.quantity}</p>

                         {/* <QuantitySelector   //error: Property 'max' is missing in type '{ quantity: number; onQuantityChanged: (quantity: number) => void; }' but required in type 'Props
                            onQuantityChanged={(quantity) =>
                                updateProductQuantity(product, quantity)
                            }
                        />  */}

                        <button
                            onClick={() => removeProduct(product)}
                            className="underline mt-3"
                        >
                            Remover
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};
