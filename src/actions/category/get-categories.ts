'use server';

import prisma from '@/lib/prisma';

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { Product: true }, 
        },
      },
    });

    const categoriesWithProductCount = categories.map(category => ({
      ...category,
      productCount: category._count.Product,
    }));

    return categoriesWithProductCount;

  } catch (error) {
    console.log(error);
    return [];
  }
};
