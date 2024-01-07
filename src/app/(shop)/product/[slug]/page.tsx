export const revalidate = 604800; //7 Dias

import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideshow, ProductSlideshow } from "@/components";
import { getProductBySlug } from "@/actions";
import { ResolvingMetadata } from "next/types";
import AddToCart from "./ui/AddToCart";
import { Product } from '../../../../interfaces/product.interface';
import { currencyFormat } from "@/utils";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = params.slug;

    // fetch data
    const product = await getProductBySlug(slug);

    // optionally access and extend (rather than replace) parent metadata
    //const previousImages = (await parent).openGraph?.images || []

    return {
        title: product?.title,
        description: product?.description ?? "",
        openGraph: {
            title: product?.title,
            description: product?.description ?? "",
            images: [`/products/${product?.images[1]}`],
        },
        
    };
}

export default async function ProductBySlugPage({ params }: Props) {
    const { slug } = params;
    const product = await getProductBySlug(slug);
    const variants = product?.variants ?? [];
    const productStock = product?.stock ?? 0;
    const hasVariables = product?.hasVariables ?? false;

    if (!product) {
        notFound();

        return <div>Producto no encontrado</div>;
    }
    
    return (
        <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Slideshow */}

            <div className="col-span-1 md:col-span-3">
                {/* Mobile Slideshow */}
                <ProductMobileSlideshow
                    title={product.title}
                    images={product.images}
                    className="block md:hidden"
                />

                {/* Desktop Slideshow */}
                <ProductSlideshow
                    title={product.title}
                    images={product.images}
                    className="hidden md:block"
                />
            </div>

            {/* Detalles del producto */}
            <div className="col-span-2 px-5">
                <h1
                    className={` ${titleFont.className} antialiased font-bold text-lg`}
                >
                    {product.title} - 
                </h1>
                <p className="text-base mb-5">{currencyFormat(product.normal_price)}</p>

                <AddToCart
                    product={product}
                    variants={variants}
                    hasVariables={hasVariables}
                    productStock={productStock}
                    
                    //attributeTypes={[]} // error: Type '{ variants: Variant[]; hasVariables: boolean; productStock: number; attributeTypes: never[]; }' is not assignable to type 'IntrinsicAttributes & Props'.

                    
                />

                {/* Descripción */}
                <h3 className="font-bold text-sm">Descripción</h3>
                <p className="font-light">{product.description}</p>
            </div>
        </div>
    );
}
