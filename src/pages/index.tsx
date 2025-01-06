import AnalyticsCard from "@/components/AnalyticsCard";
import AreaCard from "@/components/AreaCard";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex justify-center gap-5 mt-10">
        <AnalyticsCard name="Today's Collection" amount={10000} />
        <AnalyticsCard name="Monthly Collection" amount={100000} />
      </div>
      <div className="flex justify-center gap-5 mt-10">
        <AreaCard name="Area 1" areaId="10" />
      </div>
    </>
  );
};

export default Home;
