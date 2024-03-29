"use client";

import { placeOrder } from "@/actions";
//import Payment from "@/payment/payment/Payment";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from 'react-dom';

interface PaymentDetails {
    amount: number;
    tax: number;
    description: string;
}

export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const [isPlacingOrder, setsPlacingOrder] = useState(false);

    //const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

    const address = useAddressStore((state) => state.address);

    const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
        state.getSummaryInformation()
    );

    const cart = useCartStore((state) => state.cart);
    const clearCart = useCartStore((state) => state.clearCart);


    useEffect(() => {
        setLoaded(true);
    }, []);

    const onPlaceOrder = async () => {
        setsPlacingOrder(true);
        //await sleep(2);

        const productsToOrder = cart.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            variantId: product.variant?.id, 

        }));

        //Server Action
        const resp = await placeOrder(productsToOrder, address);
        if ( !resp.ok ){
            seterrorMessage(resp.message);
            setsPlacingOrder(false);
            return;
        }

        // setPaymentDetails({
        //     amount: resp.order?.subTotal ?? 0, 
        //     tax: resp.order?.tax ?? 0,         
        //     description: `Pago orden ${resp.prismaTx?.order.id ?? ''}`, 
        // });
        

        
       clearCart();  
        router.replace('/orders/' + resp.order?.id)

    };

    if (!loaded) {
        return <p>Cargando..</p>;
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">
                    {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.country}</p>
                <p>{address.postalCode}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">
                    {itemsInCart === 1
                        ? "1 Articulo"
                        : `${itemsInCart} Articulos`}
                </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>ITBMS (7%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">
                    {currencyFormat(total)}
                </span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en &quot; Colocar orden &quot;, aceptas
                        nuestros{" "}
                        <a href="#" className="underline">
                            términos y condiciones
                        </a>{" "}
                        y{" "}
                        <a href="#" className="underline">
                            política de privacidad
                        </a>
                    </span>
                </p>
                {/* {paymentDetails && (
                <Payment
                    amount={paymentDetails.amount} 
                    tax={paymentDetails.tax} 
                    description={paymentDetails.description} 
                />
            )} */}

                <p className="text-red-500">{errorMessage}</p> 
                <button
                    //href="/orders/123"
                    onClick={onPlaceOrder}
                    className={clsx({
                        "btn-primary": !isPlacingOrder,
                        "btn-disabled": isPlacingOrder,
                    })}
                >
                    Realizar Pedido
                </button>
            </div>
        </div>
    );
};
