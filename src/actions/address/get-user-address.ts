"use server";

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
    try {
        const addresses = await prisma.userAddress.findMany({
            where: { userId },
        });

        if (addresses.length === 0) return null;
        
        return addresses.map(({ countryId, address2, ...rest }) => ({
            ...rest,
            country: countryId,
            address2: address2 ? address2 : "",
        }));

    } catch (error) {
        console.log(error);
        return null;
    }
};
