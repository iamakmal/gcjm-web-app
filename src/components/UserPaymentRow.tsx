import { PaymentType } from "@/types/types";
import React from "react";

interface Props {
  payment: PaymentType;
}

const UserPaymentRow = ({ payment }: Props) => {
  return (
    <tr>
      <td>{payment?.year}</td>
      <td>
        {payment?.month?.map((month: string, index: number) => (
          <div key={index}>{month}</div>
        ))}
      </td>
      <td>{payment?.amount}</td>
      <td>{payment.paidAt.toDate().toLocaleString()}</td>
      <td>{payment?.status}</td>
    </tr>
  );
};

export default UserPaymentRow;
