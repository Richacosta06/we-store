"use server";

import prisma from "@/lib/prisma";
import { Product } from "@/interfaces";

// Definición de tipos
interface Stock {
    quantity: number;
}

interface Variable {
    variable_type: string;
    variable_value: string;
    Stock: Stock;
}

interface VariableGroupItem {
    variable_value: string;
    Stock: number;
}

interface ProductWithImagesAndVariables extends Product {
    images: string[];
    variables: Record<string, VariableGroupItem[]>;
}

export const getProductBySlug = async (
    slug: string
): Promise<ProductWithImagesAndVariables | null> => {
    try {
        const product = await prisma.product.findFirst({
            include: {
                ProductImage: {
                    select: { url: true },
                },
                Variable: {
                    select: {
                        variable_type: true,
                        variable_value: true,
                        Stock: {
                            select: {
                                quantity: true,
                            },
                        },
                    },
                },
            },
            where: { slug: slug },
        });

        if (!product) return null;

        const variablesGroupedByType = product.Variable.reduce(
            (acc: Record<string, VariableGroupItem[]>, variable) => {
                const { variable_type, variable_value, Stock } = variable;

                if (!acc[variable_type]) acc[variable_type] = [];
                acc[variable_type].push({
                    variable_value,
                    Stock: Stock ? Stock.quantity : 0, 
                });

                return acc;
            },
            {}
        );

        return {
            ...product,
            images: product.ProductImage.map((image) => image.url),
            variables: variablesGroupedByType,
        };
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener producto por slug");
    }
};
