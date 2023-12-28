export interface Product {
    id:string;
    description: string;
    //todo: images: string[];
    //inStock: number;
    normal_price: number;
    //sizes: Size[];
    slug: string;
    tags: string[];
    title: string;
    //TODO: type: Type;
    //gender: Category;
}

export type Category = 'men'|'women'|'kid'|'unisex';
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';