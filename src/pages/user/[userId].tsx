import { useGetPaymentsOfUser, useGetUserById } from "@/api/areaApi";
import GoBackButton from "@/components/GoBackButton";
import UserPaymentTable from "@/components/UserPaymentTable";
import { PaymentType } from "@/types/types";
import { NextPage } from "next";
import { useRouter } from "next/router";

const User: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId;
  const { data: userData, isPending: isUserPending } = useGetUserById(
    userId as string
  );
  const { data: paymentData, isPending: isPaymentPending } =
    useGetPaymentsOfUser(userId as string);

  if (isUserPending && isPaymentPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <GoBackButton />
        <h1 className="text-center text-2xl font-semibold flex-grow">
          User Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
        {/* Left Column */}
        <div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">Name:</p>
            <p className="text-xl text-[#979dab]">{userData?.name}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">
              Reference No:
            </p>
            <p className="text-xl text-[#979dab]">{userData?.refNo}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">UID:</p>
            <p className="text-xl text-[#979dab]">{userData?.uid}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">NIC:</p>
            <p className="text-xl text-[#979dab]">{userData?.NIC}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">Area Code:</p>
            <p className="text-xl text-[#979dab]">{userData?.areaId}</p>
          </div>
          <div className="divider"></div>
        </div>
        {/* Right Column */}
        <div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">Contact No:</p>
            <p className="text-xl text-[#979dab]">{userData?.contactNo}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">
              Subscription:
            </p>
            <p className="text-xl text-[#979dab]">{userData?.subscription}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">Address:</p>
            <p className="text-xl text-[#979dab]">{userData?.address}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">
              Last Payment:
            </p>
            <p className="text-xl text-[#979dab]">{userData?.lastPayment}</p>
          </div>
          <div className="divider"></div>
          <div className="flex gap-5 justify-between">
            <p className="text-xl font-semibold text-[#596170]">
              Last Payment Date:
            </p>
            <p className="text-xl text-[#979dab]">
              {new Date(userData?.lastPaymentDate).toLocaleString()}
            </p>
          </div>
          <div className="divider"></div>
        </div>
      </div>
      <UserPaymentTable
        payment={paymentData as PaymentType[]}
        isLoading={isPaymentPending}
      />
    </>
  );
};

export default User;
