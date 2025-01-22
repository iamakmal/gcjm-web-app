import {
  fetchMonthCollection,
  fetchTodayCollection,
  useGetAreas,
} from "@/api/areaApi";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import AnalyticsCard from "@/components/AnalyticsCard";
import AreaCard from "@/components/AreaCard";
import { AreaType } from "@/types/types";
import { NextPage } from "next";
import { useFirebase } from "@/contexts/firebaseContext";
import { useRouter } from "next/router";
import { FaUsers, FaMapMarkedAlt, FaMoneyBillWave } from "react-icons/fa";
import { useEffect, useState } from "react";



const fetchUsers = async () => {
  const usersCollection = collection(firestore, "users");
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.length; // Return the total number of users
};

const getCurrentDay = () => {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date()
  );
};

const getCurrentMonth = () => {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
};

const Home: NextPage = () => {
  const { data: areaData = [], isLoading: areasLoading } = useGetAreas();
  const { data: userCount, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { user, loading } = useFirebase();
  const router = useRouter();

  

  const [todayCollection, setTodayCollection] = useState(0);
  const [monthCollection, setMonthCollection] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const currentYear = new Date().getFullYear(); // Get the current year dynamically
        fetchTodayCollection().then(setTodayCollection);
        fetchMonthCollection().then(setMonthCollection);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading || usersLoading || areasLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const currentDay = getCurrentDay();
  const currentMonth = getCurrentMonth();

  // Prepare chart data

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5">
        <AnalyticsCard
          name="Total Areas"
          amount={areaData?.length || 0}
          icon={<FaMapMarkedAlt className="h-8 w-8 text-white" />}
          bgColor="#1E5866" // Match color for "Areas"
        />
        <AnalyticsCard
          name="Total Users"
          amount={userCount || 0}
          icon={<FaUsers className="h-8 w-8 text-white" />}
          bgColor="#28A745" // Match color for "Users"
        />
        <AnalyticsCard
          name={`${currentDay} Collection`}
          amount={todayCollection}
          icon={<FaMoneyBillWave className="h-8 w-8 text-white" />}
          isCurrency={true}
          bgColor="#FFC107"
        />
        <AnalyticsCard
          name={`${currentMonth} Collection`}
          amount={monthCollection}
          icon={<FaMoneyBillWave className="h-8 w-8 text-white" />}
          isCurrency={true}
          bgColor="#6F42C1"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {areasLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="skeleton rounded-xl h-24 w-24 md:h-48 md:w-48"
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
      {/* Bar chart for Monthly Collection */}
    </>
  );
};

export default Home;
