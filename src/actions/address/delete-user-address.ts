"use server";

import prisma from "@/lib/prisma";

export const deleteAddress = async (id: string) => {
    try {
        const deleted = await prisma.userAddress.delete({
            where: { id },
        });

        return { ok: true };
    } catch (error) {
        console.log(error);

        return {
            ok: false,
            message: "No se pudo eliminar la direccion",
        };
    }
};
