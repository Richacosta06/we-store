"use client";

import { titleFont } from "@/config/fonts";
import { useUIStore } from "@/store";
import Link from "next/link";

import { IoSearchOutline, IoCartOutline } from "react-icons/io5";

export const TopMenu = () => {
    const openSiteMenu = useUIStore((state) => state.openSideMenu);

    return (
        <nav className="flex px-5 justify-between items-center w-full shadow-2xl">
            {/* Logo */}
            <div>
                <Link href="/">
                    <span
                        className={`${titleFont.className} antialiased font-bold`}
                    >
                        T-Rex
                    </span>
                    <span> | Balance Bike</span>
                </Link>
            </div>

            {/* Center Menu */}
            <div className="hidden sm:block">
                <Link
                    className="m2 p-2 rounded-md transition-all hover:bg-gray-200"
                    href="/category/Hoodies"
                >
                    Hoodies
                </Link>
                <Link
                    className="m2 p-2 rounded-md transition-all hover:bg-gray-200"
                    href="/category/Hats"
                >
                    Hats
                </Link>
                <Link
                    className="m2 p-2 rounded-md transition-all hover:bg-gray-200"
                    href="/category/Shirts"
                >
                    Shirts
                </Link>
            </div>

            {/* Search, Cart, Menu */}
            <div className="flex items-center">
                <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>

                <Link href="/cart" className="mx-2">
                    <div className="relative">
                        <span className="absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                            3
                        </span>
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>

                <button
                    onClick={openSiteMenu}
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                >
                    Menú
                </button>
                <div className="ml-5 ">
                    <button className="flex items-center justify-center h-10 px-4 bg-black hover:bg-gray-700 text-white rounded">
                        VENDER
                    </button>
                </div>
            </div>
        </nav>
    );
};
