"use client";

import { getProductBySlug } from "@/actions";
import { QuantitySelector, VariableSelector } from "@/components";
import { Product, ProductImage } from "@prisma/client";
import { useState } from "react";
import { ProductWithImagesAndVariants } from "../../../../../actions/product/get-product-by-slug";
import { useCartStore } from "@/store";
import type { CartProduct } from "../../../../../interfaces/product.interface";
import Link from "next/link";
import CartPage from '../../../cart/page';

export interface Variant {
    attributes: Record<string, string>;
    stock: number;
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

    const handleAttributeSelection = (
        attributeName: string,
        attributeValue: string
    ) => {
        const updatedAttributes = {
            ...selectedAttributes,
            [attributeName]: attributeValue,
        };
        // console.log(
        //     `Atributo seleccionado: ${attributeName} - Valor: ${attributeValue}`
        // );

        setSelectedAttributes(updatedAttributes);
        // console.log(`Atributos seleccionados actualizados:`, updatedAttributes);

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
            // Buscar la variante que coincide con la selección actual
            const matchingVariant = variants.find((variant) =>
                Object.entries(updatedAttributes).every(
                    ([name, value]) => variant.attributes[name] === value
                )
            );

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);
                // console.log("Variante encontrada:", matchingVariant);
            } else {
                // console.log(
                //     "No se encontró una variante que coincida con los atributos seleccionados:",
                //     updatedAttributes
                // );
            }
        }
    };

    //revisa este fracmento de codigo, no esta funcionando
    const addToCart = () => {
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
            {showAddToCartMessage && (
                <div className="bg-green-700 p-2 my-4 rounded sha text-white fade-in">
                    <Link href="/cart">

                    <p>Producto agregado al carrito!
                    <span className="cursor-pointer hover:underline mx-2">Ver Carrito</span>
                    </p>
                    </Link>
                </div>
            )}

            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />

            {/* Button */}
            <button
                onClick={addToCart} //error: Cannot fint name addToCart
                className="btn-primary my-5"
            >
                Agregar al carrito
            </button>
        </>
    );
};

export default AddToCart;
