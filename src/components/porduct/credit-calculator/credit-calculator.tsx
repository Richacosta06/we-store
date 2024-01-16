import { dateFormat } from "@/utils";
import { currencyFormat } from '../../../utils/currencyFormat';

interface Props  {
  price: number;
};

export const CreditCalculator = ({ price }: Props) => {
  // Calcular el valor inicial y las cuotas
  const inicial = price * 0.5;
  const cuota = (price * 0.5) / 3;

  // Calcular fechas de las cuotas
  const baseDate = new Date();

  const Payments = [1, 2, 3].map(numCuota => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 14 * numCuota);
    return dateFormat(date);

  });

  return (
    <div className="pt-5 rounded-md shadow-lg p-6 mt-4">
    <h2 className="text-lg text-white font-semibold   bg-blue-600 p-2 rounded">Págalo en cuotas sin intereses</h2>
      <p className="text-lg my-1 mt-4 font-semibold">Inicial:<span className=" text-white bg-blue-600 rounded-2xl p-2 mx-4">${inicial.toFixed(2)}</span></p>
      <h3 className="mt-4 mb-2 font-semibold">Cuotas Quincenales</h3>
      <div className="flex justify-between font-medium">
        <p>{Payments[0]}:</p>
        <p className="font-bold text-lg text-gray-600">{currencyFormat(cuota)}</p>
      </div>
      <div className="flex justify-between font-medium">
        <p>{Payments[1]}:</p>
        <p className="font-bold text-lg text-gray-600">{currencyFormat(cuota)}</p>
      </div>
      <div className="flex justify-between font-medium">
        <p>{Payments[2]}:</p>
        <p className="font-bold text-lg text-gray-600">{currencyFormat(cuota)}</p>
      </div>

    </div>
  );
};

