"use server";

import prisma from "@/lib/prisma";
import { Product } from "@/interfaces";

// Definición de tipos
interface Variant {
    attributes: Record<string, string>; // Ejemplo: { Talla: "M", Color: "Rojo" }
    stock: number;
}

export interface ProductWithImagesAndVariants extends Product {
    images: string[];
    variants: Variant[];
    stock: number;
    hasVariables: boolean;
}

export const getProductBySlug = async (
    slug: string
): Promise<ProductWithImagesAndVariants | null> => {
    try {
        const product = await prisma.product.findFirst({
            include: {
                ProductImage: { select: { url: true } },
                ProductVariant: {
                    include: {
                        ProductVariantAttribute: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
            },
            where: { slug: slug },
        });
        if (!product) return null;

        const variants = product.ProductVariant.map((variant) => {
            const attributes = variant.ProductVariantAttribute.reduce<Record<string, string>>(
                (acc, pva) => {
                    acc[pva.attribute.name] = pva.value;

                    return acc;
                },
                {}
            );

            return {
                id: variant.id,
                attributes,
                stock: variant.stock,
            };
        });

        return { 

            ...product,
            images: product.ProductImage.map((image) => image.url),
            variants: variants,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener producto por slug");
    }
};
