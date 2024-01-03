"use client";

import { QuantitySelector, VariableSelector } from "@/components";
import { useState } from "react";

interface Variant {
    attributes: Record<string, string>;
    stock: number;
}

interface Props {
    variants: Variant[];
    hasVariables: boolean;
    productStock: number;
}

export const AddToCart = ({ variants, hasVariables, productStock }: Props) => {
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
        console.log(
            `Atributo seleccionado: ${attributeName} - Valor: ${attributeValue}`
        );

        setSelectedAttributes(updatedAttributes);
        console.log(`Atributos seleccionados actualizados:`, updatedAttributes);

        // Buscar la variante que coincide con la selección actual
        const matchingVariant = variants.find((variant) =>
            Object.entries(updatedAttributes).every(
                ([name, value]) => variant.attributes[name] === value
            )
        );

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
            console.log("Variante encontrada:", matchingVariant);
        } else {
            console.log(
                "No se encontró una variante que coincida con los atributos seleccionados:",
                updatedAttributes
            );
        }
    };

    return (
        <>
            {/* Selector de Variables */}

            <VariableSelector
                variants={variants}
                hasVariables={hasVariables}
                productStock={productStock}
                onAttributeSelected={handleAttributeSelection}
                selectedAttributes={selectedAttributes}
            />

            {/* Selector de Cantidad */}
            <QuantitySelector quantity={1} />

            {/* Button */}
            <button className="btn-primary my-5">Agregar al carrito</button>
        </>
    );
};

export default AddToCart;
