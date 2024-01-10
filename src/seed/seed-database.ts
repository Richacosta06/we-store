import { initialData } from "./seed";
import prisma from "../lib/prisma";
import { countries } from "./seed-countries";

async function main() {
    // Delete existing 
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.userAddress.deleteMany();
    await prisma.country.deleteMany();
    await prisma.productImage.deleteMany();

    await prisma.productVariantAttribute.deleteMany();
    await prisma.attribute.deleteMany();
    await prisma.productVariant.deleteMany();
    
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    // Create global attributes
    const sizeAttribute = await prisma.attribute.create({
        data: { name: "Talla" },
    });
    const colorAttribute = await prisma.attribute.create({
        data: { name: "Color" },
    });

    // Create categories
    const categoriesData = initialData.categories.map((category) => ({
        name: category,
    }));
    await prisma.category.createMany({ data: categoriesData });
    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id;
        return map;
    }, {} as Record<string, string>);

    // Create products
    for (const product of initialData.products) {
        const { type, images, inStock, price, sizes, ...rest } = product;
        const hasVariables = Math.random() > 0.5;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type],
                normal_price: price,
                offer_price: price - price / 1.2,
                hasVariables: hasVariables,
                stock: hasVariables ? 0 : 100, // Assign stock if no variants
            },
        });

        // Images
        const imagesData = images.map((image) => ({
            url: image,
            productId: dbProduct.id,
        }));

        await prisma.productImage.createMany({
            data: imagesData,
        });

        // Create variants for products with variables
        if (hasVariables) {
            const sizes = ["M", "L", "XL"];
            const colors = ["Rojo", "Azul"];

            for (const size of sizes) {
                for (const color of colors) {
                    const variant = await prisma.productVariant.create({
                        data: {
                            productId: dbProduct.id,
                            stock: 100, // Assign stock for this variant
                        },
                    });

                    // Associate size and color with the variant
                    await prisma.productVariantAttribute.createMany({
                        data: [
                            {
                                variantId: variant.id,
                                attributeId: sizeAttribute.id,
                                value: size,
                            },
                            {
                                variantId: variant.id,
                                attributeId: colorAttribute.id,
                                value: color,
                            },
                        ],
                    });
                }
            }
        }
        // Crear Usuarios
    }
    const { users } = initialData;

    await prisma.user.createMany({
        data: users,
    });

    await prisma.country.createMany({
        data: countries,
    });
}

console.log("Seed ejecutado correctamente");

(() => {
    if (process.env.NODE_ENV === "production") return;

    main();
})();
