// pages/index.tsx (Home Page)
import { useGetAreas } from "@/api/areaApi";
import AnalyticsCard from "@/components/AnalyticsCard";
import AreaCard from "@/components/AreaCard";
import { AreaType } from "@/types/types";
import { NextPage } from "next";
import { useFirebase } from "@/contexts/firebaseContext"; // Import the FirebaseContext hook
import { useRouter } from "next/router"; // For redirection

const Home: NextPage = () => {
  const { data: areaData, isLoading } = useGetAreas();
  const { user, loading } = useFirebase(); // Get user and loading from FirebaseContext
  const router = useRouter();

  if (loading) return <div>Loading...</div>; // Show loading while fetching the auth state

  // If not logged in, redirect to the login page
  if (!user) {
    router.push("/login");
    return null;
  }

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
