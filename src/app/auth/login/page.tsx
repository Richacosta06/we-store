import { titleFont } from "@/config/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen pt-28 sm:pt-36">
            <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>
            <LoginForm/>

        </div>
    );
}
