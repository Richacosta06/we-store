import { notFound } from "next/navigation";
import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Category } from "@/interfaces";

interface Props {
    params: {
        id: Category;
    };
}

const products = initialData.products;


export default function ({ params }: Props) {
    const { id } = params;

    const filteredProducts = products.filter(product => product.gender === id);
    
    const labels: Record<Category, string>  = {
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
                title={labels[id]}
                subtitle={`Productos para ${labels[id]}`}
                className="mb-2"
            />
            <ProductGrid products={filteredProducts} />
        </>
    );
}
