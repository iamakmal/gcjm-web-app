import { useGetAreaById, useGetUsersByArea } from "@/api/areaApi";
import AddUser from "@/components/AddUser";
import GoBackButton from "@/components/GoBackButton";
import TableRow from "@/components/TableRow";
import { UserType } from "@/types/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Area: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const areaId = router.query.areaId;
  const { data: areaData } = useGetAreaById(areaId as string);
  const { data: usersData, isLoading } = useGetUsersByArea(areaData?.areaCode);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <GoBackButton />
        <h1 className="text-2xl text-center font-semibold flex-grow">
          Area {areaData?.name}
        </h1>
      </div>
      <div className="flex justify-end">
        <button className="btn" onClick={handleOpenModal}>
          Add New User
        </button>
      </div>
      <div className="px-10 mt-10 overflow-x-auto">
        <table className="table table-zebra">
          <thead className="text-lg">
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>Contact No</th>
              <th>Subscription</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="text-center">
                      <div className="skeleton h-10 w-full rounded-none"></div>
                    </td>
                  </tr>
                ))
              : usersData?.map((user: UserType) => (
                  <TableRow key={user.uid} user={user} />
                ))}
          </tbody>
        </table>
      </div>
      <AddUser
        areaCode={areaData?.areaCode}
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Area;
