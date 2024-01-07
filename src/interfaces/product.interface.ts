import { Variant } from '../app/(shop)/product/[slug]/ui/AddToCart';

export interface Product {
    id:string;
    description: string;
    images: string[];
    //inStock: number;
    normal_price: number;
    offer_price: number;
    //variables: Variable[];
    slug: string;
    tags: string[];
    title: string;
    //TODO: type: Type;
    //gender: Category;
}

export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    normal_price: number;
    offer_price: number;
    quantity: number;
    variant?: Variant;
    image: string;
  }
  

export type Category = 'men'|'women'|'kid'|'unisex';
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';