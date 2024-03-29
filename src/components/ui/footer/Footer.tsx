import { titleFont } from "@/config/fonts";
import Link from "next/link";

export const Footer = () => {
    return (
        <div className="flex w-full justify-center text- mb-10 mt-10">
            <Link href="/">
                <span
                    className={`${titleFont.className} antialiased font-bold `}
                >
                    T-Rex{" "}
                </span>
                <span>| Balance Bike </span>
                <span>© {new Date().getFullYear()}</span>
            </Link>

            <Link href="/" className="mx-3">
                Privacidad & Legal
            </Link>

            <Link href="/" className="mx-3">
                Ubicaciones
            </Link>
        </div>
    );
};
