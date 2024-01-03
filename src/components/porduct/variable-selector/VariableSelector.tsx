import clsx from "clsx";

interface Variant {
    attributes: Record<string, string>;
    stock: number;
}

interface Props {
    selectedVariant?: Variant[];
    variants: Variant[];
    hasVariables: boolean;
    productStock: number; // Stock total del producto
    selectedAttributes: Record<string, string>; // Agregar esta línea
    onAttributeSelected: (
        attributeName: string,
        attributeValue: string
    ) => void;
}

export const VariableSelector = ({
    variants,
    selectedVariant,
    hasVariables,
    productStock,
    onAttributeSelected,
    selectedAttributes,
}: Props) => {
    let totalStock = 0;

    // Calcular el stock total
    if (hasVariables) {
        totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
    } else {
        // Si no tiene variables, usar el stock total del producto
        totalStock = productStock;
    }

    // Agrupar los valores de atributos por su tipo (Talla, Color, etc.)
    const groupedAttributes = variants.reduce((acc, variant) => {
        Object.entries(variant.attributes).forEach(
            ([attributeName, attributeValue]) => {
                if (!acc[attributeName]) {
                    acc[attributeName] = new Set();
                }
                acc[attributeName].add(attributeValue);
            }
        );
        return acc;
    }, {} as Record<string, Set<string>>);

    return (
        <div>
            <h2 className="mb-4">Stock: {totalStock}</h2>
            {Object.entries(groupedAttributes).map(
                ([attributeName, attributeValues]) => (
                    <div key={attributeName} className="mb-6">
                        <h3 className="font-bold mb-4">
                            Seleccionar {attributeName}
                        </h3>
                        <div className="flex">
                            {Array.from(attributeValues).map((value) => (
                                <button
                                    key={value}
                                    onClick={() =>
                                        onAttributeSelected(
                                            attributeName,
                                            value
                                        )
                                    }
                                    className={clsx(
                                        "mx-2 hover:underline text-lg",
                                        {
                                            underline:
                                                selectedAttributes[
                                                    attributeName
                                                ] &&
                                                selectedAttributes[
                                                    attributeName
                                                ] === value,
                                        }
                                    )}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};
