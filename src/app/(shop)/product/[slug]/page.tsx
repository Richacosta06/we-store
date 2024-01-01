export const revalidate = 604800; //7 Dias

import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import {
    ProductMobileSlideshow,
    ProductSlideshow,
    QuantitySelector,
    VariableSelector,
} from "@/components";
import { getProductBySlug } from "@/actions";

interface Props {
    params: {
        slug: string;
    };
}

export default async function ProductBySlugPage({ params }: Props) {
    const { slug } = params;
    const product = await getProductBySlug(slug);
    const variables = product?.variables || {};
    
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
                    {product.title}
                </h1>
                <p className="text-base mb-5">${product.normal_price}</p>

                {/* Selector de Tallas */}
                <VariableSelector
                    variables={variables} 
                />

                {/* Selector de Cantidad */}
                <QuantitySelector quantity={1} />

                {/* Button */}
                <button className="btn-primary my-5">Agregar al carrito</button>

                {/* Descripción */}
                <h3 className="font-bold text-sm">Descripción</h3>
                <p className="font-light">{product.description}</p>
            </div>
        </div>
    );
}
