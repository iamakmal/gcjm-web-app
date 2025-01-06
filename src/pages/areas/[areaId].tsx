import TableRow from "@/components/TableRow";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Area: NextPage = () => {
  const router = useRouter();
  const areaId = router.query.areaId;
  console.log(router.query.areaId);
  return (
    <div>
      <h1 className="text-2xl text-center font-semibold">Area {areaId}</h1>
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
    </div>
  );
};

export default Area;
