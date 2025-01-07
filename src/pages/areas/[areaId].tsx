import AddUser from "@/components/AddUser";
import TableRow from "@/components/TableRow";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Area: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const areaId = router.query.areaId;
  console.log(router.query.areaId);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <h1 className="text-2xl text-center font-semibold">Area {areaId}</h1>
      <div className="flex justify-end">
        <button className="btn" onClick={handleOpenModal}>
          Add New User
        </button>
      </div>
      <div className="px-10 mt-10 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>Address</th>
              <th>Subscription</th>
            </tr>
          </thead>
          <tbody>
            <TableRow />
            <TableRow />
            <TableRow />
            <TableRow />
          </tbody>
        </table>
      </div>
      <AddUser isModalOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Area;
