import { notFound, redirect } from "next/navigation";
import { Pagination, ProductGrid, Title } from "@/components";
import { getPaginatedProductsWithImages } from "@/actions";


interface Props {
    params: {
        category: string;
    };
}

interface Props {
    searchParams: {
        page?: string;
    };
}

export default async function ({ params, searchParams }: Props) {
    const { category } = params;

    console.log(category)
    console.log(params)

    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const { products, currentPage, totalPages } =
        await getPaginatedProductsWithImages({ 
            page,
            category,
         });

    if (products.length === 0) {
        redirect(`/category/${ category }`);
    }
    
    const labels: Record<string, string>  = {
      'men': 'Hombres',
      'women': 'Mujeres',
      'kid': 'Niños',
      'unisex': 'Unisex'
    }

    // if (id === 'perifericos'){
    //   notFound();
    // }

    return (
        <>
            <Title
                title={category}
                subtitle={`${category}`}
                className="mb-2"
            />
            <ProductGrid products={products} />

            <Pagination totalPages={totalPages}/> 
        </>
    );
}
