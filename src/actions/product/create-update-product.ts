'use server';

import prisma from '@/lib/prisma';
import { Gender, Product } from '@prisma/client';
import { z } from 'zod';
import { ProductWithImagesAndVariants, registerUser } from '..';
import { revalidatePath } from 'next/cache';

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    normal_price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    offer_price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    stock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    variants: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);


    if (!productParsed.success) {
        console.log(productParsed.error);
        return { ok: false }
    }

    const product = productParsed.data;
    product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '_').trim();

    const { id, variants, ...rest } = product;


    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product;
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());


            if (id) {
                //Actualizar
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        tags: {
                            set: tagsArray
                        }
                    }
                });

                console.log({ product });



            } else {
                //crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        tags: {
                            set: tagsArray
                        }
                    }
                })


            }


            return {
                product
            }
        });

        revalidatePath('/admin/products')
        revalidatePath(`/admin/product/${product.slug}`)
        revalidatePath(`/products/${product.slug}`)



        return {
            ok: true,
            product: prismaTx.product,
        }

    } catch (error) {

        return {
            ok: false,
            message: 'np se pudo ejecutar la accion'
        }

    }









}