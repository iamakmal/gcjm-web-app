import { UserType } from "@/types/types";
import React from "react";

interface Props {
  user: UserType;
}

const TableRow = ({ user }: Props) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.NIC}</td>
      <td>{user.contactNo}</td>
      <td>{user.subscription}</td>
      <td>{user.address}</td>
    </tr>
  );
};

export default TableRow;
