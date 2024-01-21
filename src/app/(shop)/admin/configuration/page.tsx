export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getCategories, getPaginatedUsers } from "@/actions";
import { Pagination, Title } from "@/components";

import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import { CategoriesTable } from './ui/CategoriesTable';

export default async function ConfigPage() {


  const [categories] = await Promise.all([
    getCategories(),
  ]);

  return (
    <>

      <Title title="Configuración" />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-2 mx-2">
        <div className="flex-1">
          <Title
            title=""
            subtitle="Categorias"
          />
          <CategoriesTable categories={categories} />
      
        </div>

        <div className="flex-1">
          <Title
            title=""
            subtitle="Logotipo"
          />
        </div>
      </div>

    </>
  );
}