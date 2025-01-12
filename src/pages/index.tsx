import { useGetAreas } from "@/api/areaApi";
import AnalyticsCard from "@/components/AnalyticsCard";
import AreaCard from "@/components/AreaCard";
import { AreaType } from "@/types/types";
import { NextPage } from "next";

const Home: NextPage = () => {
  const { data: areaData, isLoading } = useGetAreas();

  return (
    <>
      <div className="flex justify-center gap-5 mt-10 flex-wrap p-5">
        <AnalyticsCard name="Today's Collection" amount={10000} />
        <AnalyticsCard name="Monthly Collection" amount={100000} />
      </div>
      <div className="flex justify-center gap-5 mt-10 flex-wrap">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="skeleton rounded-2xl h-24 w-24 md:h-48 md:w-48 p-4"
              ></div>
            ))
          : areaData?.map((area: AreaType) => (
              <AreaCard
                key={area.areaId}
                name={area.shortName}
                areaId={area.areaId}
              />
            ))}
      </div>
    </>
  );
};

export default Home;
