"use client";

import { ProductWithImagesAndVariants } from "@/actions";
import { Variant } from "@/app/(shop)/product/[slug]/ui/AddToCart";
import { ProductImages } from "@/components";
import { Category, ProductImage } from "@/interfaces";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    product:
        | (ProductWithImagesAndVariants & { ProductImage?: ProductImage[] })
        | null;
    categories: Category[];
}

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    normal_price: number;
    offer_price: number;
    inStock: number;
    variants: Variant[];
    stock: number;
    hasVariables: boolean;
    tags: string;
    gender: "men" | "women" | "kid" | "unisex";
    categoryId: string;

    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
    const variants = product?.variants ?? [];

    const {
        handleSubmit,
        register,
        formState: { isValid },
        getValues,
        setValue,
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product?.tags?.join(", "),

            images: undefined,
        },
    });

    const [editingVariantId, setEditingVariantId] = useState<string | null>(
        null
    );

    const hasVariables = watch("hasVariables");

    const attributeNames = Array.from(
        new Set(variants.flatMap((variant) => Object.keys(variant.attributes)))
    );

    const enableEdit = (variantId: string, index: number) => {
        setEditingVariantId(variantId);
    };

    const onSubmit = async (data: FormInputs) => {
        console.log(data);
        //const formData = new FormData();

        //const { images, ...productToSave } = data;

        //if ( product?.id ){
        //formData.append("id", product.id ?? "");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
        >
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("title", { required: true })}
                    />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("slug", { required: true })}
                    />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("description", { required: true })}
                    ></textarea>
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col w-1/2 mb-2">
                        <span>Precio</span>
                        <input
                            type="number"
                            step="0.01"
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("normal_price", {
                                required: true,
                                min: 0,
                            })}
                        />
                    </div>

                    <div className="flex flex-col w-1/2 mb-2">
                        <span>Precio Oferta</span>
                        <input
                            type="number"
                            step="0.01"
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("offer_price", {
                                required: true,
                                min: 0,
                            })}
                        />
                    </div>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input
                        type="text"
                        className="p-2 border rounded-md bg-gray-200"
                        {...register("tags", { required: true })}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex flex-col w-1/2 mb-2">
                        <span>Genero</span>
                        <select
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("gender", { required: true })}
                        >
                            <option value="">[Seleccione]</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kid">Kid</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-1/2 mb-2">
                        <span>Categoria</span>
                        <select
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("categoryId", { required: true })}
                        >
                            <option value="">[Seleccione]</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button className="btn-primary w-full">Guardar</button>
            </div>

            {/* Selector fotos y variables*/}
            <div className="w-full">

                {/* Checkbox para activar producto variable */}
                <div className="flex mb-4">
                    <label
                        htmlFor="hasVariables"
                        className="mr-2 font-semibold"
                    >
                        Producto Variable?:
                    </label>
                    <input
                        type="checkbox"
                        id="hasVariables"
                        {...register("hasVariables")}
                        onChange={(e) => {
                            
                            if (variants.length === 0 || e.target.checked) {
                                setValue("hasVariables", e.target.checked);
                            }
                        }}
                        checked={getValues("hasVariables")}
                    />
                </div>

                {!hasVariables && (
                    <div className="flex flex-col mb-2">
                        <span>Stock</span>
                        <input
                            type="number"
                            className="p-2 border rounded-md bg-gray-200"
                            {...register("stock", { required: true })}
                        />
                    </div>
                )}

                {/* Mostrar tabla de variantes si hasVariables es verdadero */}
                {hasVariables && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-200 rounded shadow">
                            <thead>
                                <tr>
                                    {attributeNames.map((name) => (
                                        <th
                                            key={name}
                                            className="border-b border-gray-300 px-4 py-2 text-left"
                                        >
                                            {name}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-left border-b border-gray-300">
                                        Stock
                                    </th>
                                    <th className="text-center px-4 py-2 border-b border-gray-300">
                                        Eliminar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b border-gray-300"
                                    >
                                        {attributeNames.map((attr) => (
                                            <td
                                                key={attr}
                                                className="px-4 py-2"
                                            >
                                                {variant.attributes[attr] ||
                                                    "-"}
                                            </td>
                                        ))}

                                        <td className="px-4 py-2 cursor-pointer">
                                            {editingVariantId === variant.id ? (
                                                <input
                                                    type="number"
                                                    {...register(
                                                        `variants.${index}.stock`
                                                    )}
                                                    className="p-1 border rounded-md bg-white w-1/3"
                                                    onBlur={() =>
                                                        setEditingVariantId(
                                                            null
                                                        )
                                                    }
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    onClick={() =>
                                                        enableEdit(
                                                            variant.id,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {getValues(
                                                        `variants.${index}.stock`
                                                    ) || variant.stock}{" "}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                // onClick={() =>
                                                //     handleDelete(variant.id)
                                                // }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                                            >
                                                X
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col mt-5">
                    <div className="flex flex-col mb-2">
                        <span className="font-semibold">Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {product?.ProductImage?.map((image) => (
                            <div key={image.id}>
                                <ProductImages
                                    alt={product.title ?? ""}
                                    src={image.url}
                                    width={300}
                                    height={300}
                                    className="rounded-t shadow-md"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        console.log(image.id, image.url)
                                    }
                                    //onClick={() => deleteProductImage(image.id, image.url)}
                                    className="btn-danger w-full rounded-b-xl btn-danger"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap"></div>
        </form>
    );
};
