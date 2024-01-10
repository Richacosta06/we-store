"use server";

import { ExtendedAddress } from "@/app/(shop)/checkout/address/ui/AdressList";
import type { Variant } from "@/app/(shop)/product/[slug]/ui/AddToCart";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    variantId?: string;
}

export const placeOrder = async (
    productIds: ProductToOrder[],
    address: ExtendedAddress
) => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return {
            ok: false,
            message: "No hay sesion de usuario",
        };
    }

    //obtener informacion de los productos
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map((p) => p.productId),
            },
        },
    });

    //Calcular montos

    const itemsInOrder = productIds.reduce(
        (count, product) => count + product.quantity,
        0
    );

    //calcular totales tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce(
        (totals, item) => {
            const productQuantity = item.quantity;
            const product = products.find(
                (product) => product.id === item.productId
            );

            if (!product) throw new Error(`${item.productId} no existe - 500`);

            const subTotal = product.normal_price * productQuantity;
            const tax = subTotal * 0.07;

            totals.subTotal += subTotal;
            totals.tax += tax;
            totals.total += subTotal + tax;

            return totals;
        },
        { subTotal: 0, tax: 0, total: 0 }
    );

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            //Actualizar el stock
            for (const item of productIds) {
                if (item.variantId) {
                    // Obtener el stock actual y detalles de la variante, incluyendo los atributos
                    const variantWithAttributes =
                        await tx.productVariant.findUnique({
                            where: { id: item.variantId },
                            include: {
                                product: {
                                    select: { title: true },
                                },
                                ProductVariantAttribute: {
                                    include: {
                                        attribute: {
                                            select: { name: true },
                                        },
                                    },
                                },
                            },
                        });

                    if (!variantWithAttributes) {
                        throw new Error(
                            `La variante con ID ${item.variantId} no se encuentra`
                        );
                    }

                    if (variantWithAttributes.stock < item.quantity) {
                        const attributesDescription =
                            variantWithAttributes.ProductVariantAttribute.map(
                                (attr) =>
                                    `${attr.attribute.name}: ${attr.value}`
                            ).join(", ");
                        throw new Error(
                            `Stock insuficiente para la variante del producto '${variantWithAttributes.product.title}', Atributos: ${attributesDescription}`
                        );
                    }

                    // Actualizar el stock de la variante
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                } else {
                    // Obtener el stock actual y detalles del producto
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { title: true, stock: true },
                    });

                    if (!product || product.stock < item.quantity) {
                        throw new Error(
                            `Stock insuficiente para el producto '${product?.title}'`
                        );
                    }

                    // Actualizar el stock del producto
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
            }

            //Crear orden, emcabezado, detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map((p) => ({
                                title:
                                    products.find(
                                        (product) => product.id === p.productId
                                    )?.title ?? "No hay nada",
                                quantity: p.quantity,
                                productId: p.productId,
                                normal_price:
                                    products.find(
                                        (product) => product.id === p.productId
                                    )?.normal_price ?? 0,
                                offer_price:
                                    products.find(
                                        (product) => product.id === p.productId
                                    )?.offer_price ?? 0,
                                variantId: p.variantId ?? null,
                            })),
                        },
                    },
                },
            });

            //Crear Direccion de la orden
            const { country, id, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                    userId: userId,
                },
            });

            return {
                order: order,
                orderAddress: orderAddress,
            };
        });

        return{
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message,
        };
    }

};
