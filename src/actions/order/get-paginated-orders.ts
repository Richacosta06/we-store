"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
}

export const getPaginatedOrders = async ({
    page = 1,
    take = 10,
}: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {
        const session = await auth();

        if (session?.user.role !== "admin") {
            return {
                ok: false,
                message: "Debe de estar autenticado",
            };
        }

        const orders = await prisma.order.findMany({
          take: take,
          skip: (page - 1) * take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                OrderAddress: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const totalCount = await prisma.order.count({});

        const totalPages = Math.ceil(totalCount / take);

        return {
            ok: true,
            orders: orders,
            currentPage: page,
            totalPages: totalPages,
        };
    } catch (error) {
        console.error("Error al cargar las ordenes:", error);
        throw error;
    }
};
