import React from "react";
import dayjs from "dayjs";

const OrderHistory = ({ order, currency = "€" }) => { // Default currency set to "€"
  const actualOrderData = order?.cart?.[0]; // Access the order details in cart[0]
  const amountOrder  = order?.amount / 100

  return (
    <>
      <td className="px-5 py-3 leading-6 whitespace-nowrap">
        <span className="uppercase text-sm font-medium">
          {order?.orderCode}
        </span>
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">
          {dayjs(order?.createdAt?.$date).format("MMMM D, YYYY")} {/* Date from $date within createdAt */}
        </span>
      </td>

      {/* <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm">{actualOrderData?.paymentMethod || 'N/A'}</span>
      </td> */}
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap font-medium text-sm">
        {order?.status === "Pago" && ( // Status from top-level 'status'
          <span className="text-emerald-600">{order.status}</span> // Assuming "Pago" is success/completed, using emerald green for "Paid/Completed"
        )}
        {order?.status === "Pendente" && (
          <span className="text-orange-500">{order.status}</span>
        )}
        {order?.status === "Cancelado" && (
          <span className="text-red-500">{order.status}</span>
        )}
        {/* {order?.status === "Processando" && (
          <span className="text-indigo-500">{order.status}</span>
        )} */}
        {/* Add other statuses and colors as needed */}
      </td>
      <td className="px-5 py-3 leading-6 text-center whitespace-nowrap">
        <span className="text-sm font-bold">
          {currency}
          {amountOrder.toFixed(2)}
        </span>
      </td>
    </>
  );
};

export default OrderHistory;