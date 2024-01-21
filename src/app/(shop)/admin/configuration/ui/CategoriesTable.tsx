'use client';

import { Category } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ExtendedCategory extends Category {
  productCount?: number;
  isEditing?: boolean;

}

interface Props {
  categories: ExtendedCategory[];
}


export const CategoriesTable = ({ categories }: Props) => {

  const [categoriesState, setCategoriesState] = useState<ExtendedCategory[]>(categories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
    console.log('formulario')
  };

  interface FormData {
    name: string;
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();


  const onSubmit = (data: FormData) => {

    setIsAddingCategory(false);
    reset({ name: '' });

    console.log(data);
    //TODO: Server Action crear Categoria
  };


  const handleEditClick = (categoryId: string) => {
    setCategoriesState(categoriesState.map(category =>
      category.id === categoryId ? { ...category, isEditing: true } : category
    ));

  };

  const handleSaveClick = (categoryId: string, newName: string) => {
    // Aquí deberías actualizar la categoría en tu backend
    console.log('Guardar', categoryId, newName);

    setCategoriesState(categoriesState.map(category =>
      category.id === categoryId ? { ...category, isEditing: false, name: newName } : category
    ));
  };

  const handleDeleteClick = (categoryId: string) => {
    // Aquí deberías actualizar la categoría en tu backend
    console.log('Eliminar', categoryId);


  };




  return (
    <>

      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-2 text-left"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-2 text-left"
            >
              Productos
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-2 text-center"
            >
              Editar
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-2 text-center"
            >
              Eliminar
            </th>

          </tr>
        </thead>
        <tbody>
          {categoriesState.map((category) => (

            <tr
              key={category.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >

              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.isEditing ? (
                  <input
                    type="text"
                    defaultValue={category.name}
                    size={category.name.length || 1}
                    className='p-1 bg-gray-200'
                    onBlur={(e) => handleSaveClick(category.id, e.target.value)}
                  />
                ) : (
                  category.name
                )}
              </td>

              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.productCount}
              </td>

              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                {category.isEditing ? (
                  <button onClick={() => handleSaveClick(category.id, category.name)} className="btn-primary mx-1">
                    Guardar
                  </button>
                ) : (
                  <button onClick={() => handleEditClick(category.id)} className="btn-primary mx-1">
                    Editar
                  </button>
                )}
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                {(!category.productCount || category.productCount === 0) && (
                  <button onClick={() => handleDeleteClick(category.id)} type="button" className="btn-danger mx-1 rounded">
                    X
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddingCategory && (
        <form onSubmit={handleSubmit(onSubmit)}>

          <input
            {...register('name')}
            placeholder="Nombre de la categoría"
            className='p-2'
          />
          <button type="submit" className="btn-primary mx-1">
            Guardar
          </button>

          <button
            type="button"
            className="btn-danger mx-1 rounded"
            onClick={() => setIsAddingCategory(false)}
          >
            X
          </button>

        </form>
      )}

      <button
        onClick={handleAddCategoryClick}
        className="mt-4 btn-primary font-bold"
      >
        +
      </button>



    </>

  );
};