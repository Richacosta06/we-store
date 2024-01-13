'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({orderId, amount}: Props) => {

  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = ((Math.round(amount * 100)) / 100).toString();


  if ( isPending ) {
    return (
      <div className="animate-pulse mb-14">
        <div className="h-12 bg-gray-300 rounded"/>
        <div className="h-12 bg-gray-300 rounded mt-2"/>

      </div>
    )
  }

  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units:[
        {
          invoice_id: orderId,
          amount: {
            value: roundedAmount,
          }
        }
      ]
    });

    const {} = await setTransactionId(Number(orderId), transactionId)

    return transactionId;   
  }

    const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {
      const details = await actions.order?.capture();
      if ( !details )return;

      await paypalCheckPayment (details.id);
    }

  return (    
    <PayPalButtons
    style={{color: "blue"}}
    createOrder={createOrder}
    onApprove = { onApprove }
    />

    
  )
}
