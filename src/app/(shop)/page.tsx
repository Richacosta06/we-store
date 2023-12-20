import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";

interface Props {
    searchParams: {
        page?: string;
    };
}

export default async function Home({ searchParams }: Props) {
    console.log(searchParams);

    const { products } = await getPaginatedProductsWithImages();

    return (
        <>
            <Title
                title="Tienda"
                subtitle="Todos los productos"
                className="mb-2"
            />
            <ProductGrid products={products} />
        </>
    );
}
