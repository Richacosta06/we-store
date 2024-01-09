"use server";

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const newAddress = await createAddress(address, userId);

        return {
            ok: true,
            address: newAddress,
        };
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo grabar la dirección",
        };
    }
};

const createAddress = async (address: Address, userId: string) => {
    try {
        console.log({ userId });

        // const storedAddress = await prisma.userAddress.findUnique({
        //     where: { userId },
        // });

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            city: address.city,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
        };

        const newAddress = await prisma.userAddress.create({
            data: addressToSave,
        });
        return newAddress;

    } catch (error) {
        console.log(error);
        throw new Error("No se pudo grabar la dirección");
    }
};
