"use client";

import { getProductBySlug } from "@/actions";
import { QuantitySelector, VariableSelector } from "@/components";
import { Product, ProductImage } from "@prisma/client";
import { useState } from "react";
import { ProductWithImagesAndVariants } from "../../../../../actions/product/get-product-by-slug";
import { useCartStore } from "@/store";
import type { CartProduct } from "../../../../../interfaces/product.interface";
import Link from "next/link";
import { sleep } from "../../../../../utils/sleep";

export interface Variant {
    attributes: Record<string, string>;
    stock: number;
    //id: string;
}

interface Props {
    product: ProductWithImagesAndVariants;
    variants: Variant[];
    hasVariables: boolean;
    productStock: number;
}

export const AddToCart = ({
    variants,
    hasVariables,
    productStock,
    product,
}: Props) => {
    const addProductToCart = useCartStore((state) => state.addProductTocart);
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

    const [posted, setposted] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedAttributes, setSelectedAttributes] = useState<
        Record<string, string>
    >({});
    const [selectedVariant, setSelectedVariant] = useState<
        Variant | undefined
    >();

    const [stockToShow, setStockToShow] = useState<number>(productStock);
    const [errorMessage, setErrorMessage] = useState("");

    const handleAttributeSelection = (
        attributeName: string,
        attributeValue: string
    ) => {
        const updatedAttributes = {
            ...selectedAttributes,
            [attributeName]: attributeValue,
        };

        setSelectedAttributes(updatedAttributes);

        // Verificar si todos los atributos necesarios han sido seleccionados
        let allAttributesSelected = true;

        if (product.hasVariables) {
            allAttributesSelected = variants.some((variant) =>
                Object.keys(variant.attributes).every(
                    (name) => updatedAttributes[name]
                )
            );
        }

        if (allAttributesSelected) {
            const matchingVariant = variants.find((variant) =>
                Object.entries(updatedAttributes).every(
                    ([name, value]) => variant.attributes[name] === value
                )
            );

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);
                setStockToShow(matchingVariant.stock); // Actualizar el stock a mostrar con el de la variante seleccionada
            } else {
                setStockToShow(productStock); // Revertir al stock del producto si no hay coincidencia
            }
            console.log("Variante encontrada:", selectedVariant);
        }
    };

    const addToCart = async () => {
        setposted(true);
        if (!selectedVariant && hasVariables) return;
        // console.log(
        //     "Variante seleccionada para agregar al carrito:",
        //     selectedVariant,
        //     "Cantidad:",
        //     quantity,
        //     "Producto",
        //     product
        // );

        if (
            quantity >
            (hasVariables && selectedVariant
                ? selectedVariant.stock
                : productStock)
        ) {
            setErrorMessage(
                "La cantidad seleccionada excede el stock disponible."
            );
            await sleep(3); // Espera 2 segundos
            setErrorMessage("");
            return;
        }
        setErrorMessage("");

        const CartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            normal_price: product.normal_price,
            offer_price: product.offer_price,
            quantity: quantity,
            variant: selectedVariant,
            image: product.images[0],
        };

        console.log("producto en carrito", CartProduct);

        addProductToCart(CartProduct);
        setposted(false);
        setQuantity(1);
        setSelectedVariant(undefined);
        setSelectedAttributes({});
        setShowAddToCartMessage(true);

        setTimeout(() => {
            setShowAddToCartMessage(false);
        }, 3000);
    };

    return (
        <>
            {posted && hasVariables && !selectedVariant && (
                <span className="mt-2 text-red-500">
                    *Seleccione todas las opciones
                </span>
            )}

            {/* Selector de Variables */}

            <VariableSelector
                variants={variants}
                hasVariables={hasVariables}
                productStock={productStock}
                onAttributeSelected={handleAttributeSelection}
                selectedAttributes={selectedAttributes}
            />
            
            {(selectedVariant || !hasVariables) && (
                <p className="text-green-600 mb-2">
                    Stock disponible: <span className="font-bold">{stockToShow}</span>
                </p>
            )}
            

            {showAddToCartMessage && (
                <div className="bg-green-700 p-2 my-4 rounded sha text-white fade-in">
                    <Link href="/cart">
                        <p>
                            Producto agregado al carrito!
                            <span className="cursor-pointer hover:underline mx-2">
                                Ver Carrito
                            </span>
                        </p>
                    </Link>
                </div>
            )}

            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={(newQuantity) => {
                    if (newQuantity <= stockToShow) {
                        setQuantity(newQuantity);
                    }
                }}
                max={stockToShow} // Pasar el stock máximo como prop
            />
            {errorMessage && (
                <div className="text-white bg-red-600 rounded p-2 mt-4">
                    {errorMessage}
                </div>
            )}

            {/* Button */}
            <button onClick={addToCart} className="btn-primary my-5">
                Agregar al carrito
            </button>
        </>
    );
};

export default AddToCart;
