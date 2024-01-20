"use client";

import Link from "next/link";
import clsx from "clsx";
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoSearchOutline,
    IoShirtOutline,
    IoTicketOutline,
} from "react-icons/io5";

import { useUIStore } from "@/store";
import { logout } from "@/actions";
import { useSession } from "next-auth/react";
import { Router } from "next/router";

export const Sidebar = () => {
    const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
    const closeMenu = useUIStore((state) => state.closeSideMenu);

    const { data: session } = useSession();

    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === "admin";

    return (
        <div>
            {/* Background Black */}
            {isSideMenuOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
            )}
            {/* Blur */}
            {isSideMenuOpen && (
                <div
                    onClick={closeMenu}
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                ></div>
            )}
            {/* Sidemenu */}
            {/* //todo: efecto slice */}
            <nav
                className={clsx(
                    "fixed p-5 right-0 top-0 h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "w-[300px] sm:w-[300px] md:w-[375px] lg:w-[500px]": true,
                        "translate-x-full": !isSideMenuOpen,
                    }
                )}
            >
                <IoCloseOutline
                    size={30}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => closeMenu()}
                />
                {/* Input */}
                <div className="relative mt-14">
                    <IoSearchOutline
                        size={20}
                        className="absolute top-2 left-2"
                    />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-base border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
                {/* Menú */}
                {isAuthenticated && (
                    <>
                        <Link
                            href="/profile"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoPersonOutline size={20} />
                            <span className="ml-3 text-xl">Perfil</span>
                        </Link>

                        <Link
                            href="/orders"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoTicketOutline size={20} />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>
                    </>
                )}

                {isAuthenticated && (
                    <button
                        className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => {
                            logout();
                            closeMenu();
                            //window.location.reload();
                        }}
                    >
                        <IoLogOutOutline size={20} />
                        <span className="ml-3 text-xl">Salir</span>
                    </button>
                )}
                {!isAuthenticated && (
                    <Link
                        href="/auth/login"
                        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeMenu()}
                    >
                        <IoLogInOutline size={20} />
                        <span className="ml-3 text-xl">Ingresar</span>
                    </Link>
                )}

                {isAdmin && (
                    <>
                        {/* Line Separator */}
                        <div className="w-full h-px bg-gray-200 my-10" />
                        <Link
                            href="/admin/products"
                            onClick={() => closeMenu()}

                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoShirtOutline size={20} />
                            <span className="ml-3 text-xl">Productos</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoTicketOutline size={20} />
                            <span className="ml-3 text-xl">Ordenes</span>
                        </Link>
                        <Link
                            href="/admin/users"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoPeopleOutline size={20} />
                            <span className="ml-3 text-xl">Usuarios</span>
                        </Link>
                        <Link
                            href="/admin/configuration"
                            onClick={() => closeMenu()}
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                        >
                            <IoPeopleOutline size={20} />
                            <span className="ml-3 text-xl">Configuración</span>
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
};
