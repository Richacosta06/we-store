import { Size } from "@/interfaces";
import { Variable } from "@prisma/client";
import clsx from "clsx";

interface VariableGroupItem {
    variable_value: string;
    Stock: number;
}

interface Props {
    //selectedSize: Size;
    variables: Record<string, VariableGroupItem[]>;
}

export const VariableSelector = ({ variables }: Props) => {
    return (
        <div>
            {Object.keys(variables).map((variableType) => {
                const variableItems = variables[variableType];
                const totalStock = variableItems.reduce((sum, item) => sum + item.Stock, 0);

                return (
                    <div key={variableType} className="mb-6">
                        <h4>Stock Total: {totalStock}</h4>
                        <h3 className="font-bold mb-4">Seleccionar {variableType}</h3>
                        <div className="flex">
                            {variableItems.map((item) => (
                                <button
                                    key={item.variable_value}
                                    className="mx-2 hover:underline text-lg"
                                >
                                    {item.variable_value}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
