"use server";

import prisma from "@/lib/prisma";



interface PaginationOptions {
    page?: number;
    take?: number;
    category?: string;
}


export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    category,
}: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            where: {
                category: {
                    name: category, 
                },
            },
        });


        const totalCount = await prisma.product.count({
            where: {
                category: {
                    name: category, 
                },
            },
        });

        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map((product) => ({
                ...product,
                images: product.ProductImage.map((image) => image.url), 
            })),
        };
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        throw error; 
    }
};
