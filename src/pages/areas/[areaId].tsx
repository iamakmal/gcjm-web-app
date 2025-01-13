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

  const totalUsers = usersData?.length || 0; // Total number of users

  return (
    <div>

      <h1 className="text-2xl text-center font-semibold">
        Area {areaData?.name}
      </h1>
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-800">
    Members: <span className="text-indigo-600">{totalUsers}</span>
  </h2>
  <button
    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
    onClick={handleOpenModal}
  >
    + Add New User
  </button>
</div>

      <div className="px-10 mt-10 overflow-x-auto">
        <table className="table table-zebra">
          <thead className="text-lg">
            <tr>
              <th>Ref No</th>
              <th>Name</th>
              <th>NIC</th>
              <th>Contact No</th>
              <th>Subscription</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="text-center">
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
