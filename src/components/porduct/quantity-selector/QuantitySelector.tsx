"use client";

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (value:number) => void;
    max: number;
}

export const QuantitySelector = ({ quantity, onQuantityChanged, max }: Props) => {

    const onValueChanged = (value: number) => {
        // Nuevo valor basado en el cambio solicitado
        const newValue = quantity + value;
    
        // Si el nuevo valor es menor que 1, no permitir la reducción adicional
        if (newValue < 1) {
            onQuantityChanged(1);
            return;
        }
    
        // Si el nuevo valor es mayor que el máximo, ajustar al máximo
        if (newValue > max) {
            onQuantityChanged(max);
            return;
        }
    
        // Si el nuevo valor está dentro del rango permitido, actualizar normalmente
        onQuantityChanged(newValue);
    };
    
    return (
        <div className="flex">
            <button onClick={() => onValueChanged(-1)}>
                <IoRemoveCircleOutline size={30} />
            </button>

            <span className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">
                {quantity}
            </span>

            <button onClick={() => onValueChanged(+1)}>
                <IoAddCircleOutline size={30} />
            </button>
        </div>
    );
};
