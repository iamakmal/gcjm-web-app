import { UserType } from "@/types/types";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  user: UserType;
}

const TableRow = ({ user }: Props) => {
  const router = useRouter();
  return (
    <tr>
      <td onClick={() => router.push(`/user/${user?.uid}`)}>{user.name}</td>
      <td>{user.NIC}</td>
      <td>{user.contactNo}</td>
      <td>{user.subscription}</td>
      <td>{user.address}</td>
    </tr>
  );
};

export default TableRow;
