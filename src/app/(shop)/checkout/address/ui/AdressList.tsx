"use client";

import { deleteAddress } from "@/actions";
import { Address } from "@/interfaces";
import { useAddressStore } from "@/store";
import { useRouter } from "next/navigation";

export interface ExtendedAddress extends Address {
    id: string;
}

interface Props {
    userAddresses: ExtendedAddress[];
}

export const AdressList = ({ userAddresses }: Props) => {
    //console.log("userAddresses", userAddresses);

    const setAddress = useAddressStore((state) => state.setAddress);
    const address = useAddressStore((state) => state.address);
    const router = useRouter();

    const handleSelectAddress = async (address: Address) => {
        setAddress(address);

        router.push("/checkout");
    };

    const handleDeleteAddress = async (id: string) => {
        await deleteAddress(id);
        window.location.reload();  //De que forma puedo evitar recargar el componente al eliminar una direccion
    };

    return (
        <div>
            {userAddresses.length > 0 ? (
                <ul>
                    {userAddresses.map((address) => (
                        <li
                            key={address.id} //error: Property 'id' does not exist on type 'Address'.ts(2339)
                            className="cursor-pointer hover:bg-gray-400 my-4 bg-gray-200 rounded p-5"
                        >
                            <div className="flex justify-between">
                                <div
                                    onClick={() => handleSelectAddress(address)}
                                >
                                    <p>
                                        {address.firstName} {address.lastName}
                                    </p>
                                    <p>
                                        {address.address}, {address.address2}
                                    </p>
                                    <p>
                                        {address.city}, {address.country}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleDeleteAddress(address.id)
                                    } //error: Property 'id' does not exist on type 'Address'.ts(2
                                    className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay direcciones registradas.</p>
            )}
        </div>
    );
};
