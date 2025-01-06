import Link from "next/link";
import React from "react";

interface Props {
  name: string;
  areaId: string;
}
const AreaCard = ({ name, areaId }: Props) => {
  return (
    <Link href={`/areas/${areaId}`}>
      <div className="flex bg-[#F4F5F7] rounded-2xl h-48 w-48 p-4 justify-center items-center">
        <p className="text-center text-4xl">{name}</p>
      </div>
    </Link>
  );
};

export default AreaCard;
