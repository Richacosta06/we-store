"use client";


import { useEffect } from 'react';

const PaymentComponent = ({amount, tax, description}) => {
    useEffect(() => {
        // Asegúrate de que este código se ejecute solo en el cliente
        if (typeof window !== 'undefined') {
            const getUrlParam = (key) => new URLSearchParams(window.location.search).get(key);

            window.pfWallet = window.pfWallet || {};
            const apiKey = "SlLmEttBcJBgyYjIq4CasgIEsOtrFaZm|DIRqQ68o2VTXcMyjU2NXaYcWy"; // AccessTokenApi
            const cclw = "6FA111E9D6A5D5CEE8F2AFDB9753BF99C52B8B566F84425760CE6BA7A857D52BD9C6D91F2E6BC4A4C618ECE1E0FF5E074AEEBC9559D9C5BA45AD34AC7EBCD2FE"; // Código Web
            
            window.pfWallet.useAsSandbox(false);
                    
            window.pfWallet.openService({ apiKey, cclw }).then(function (merchantSetup) {
                startMerchantForm(merchantSetup);
            }, function (error) {
                console.log(error);
            });

            function startMerchantForm(merchantSetup) {
                let paymentInfo = {
                    amount: amount,
                    discount: 0,
                    taxAmount: tax,
                    description: description
                };
                let setup = {
                    lang: 'es',
                    embedded: (getUrlParam('boton') == "false"),
                    container: 'container-form',
                    // ... otros parámetros
                };
                merchantSetup.init(merchantSetup.dataMerchant, paymentInfo, setup);
            }
        }
    }, []);

    return (
        <>
            <div id="container-form" className='h-96'>
                {/* El contenedor donde el SDK de pagos puede insertar su UI */}
            </div>         
            

    
                 
            
        
        </>
    );
};

export default PaymentComponent;
