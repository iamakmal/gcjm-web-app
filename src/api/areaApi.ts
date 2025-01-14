import { firestore } from "@/config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaType, PaymentType, UserType } from "@/types/types";

const getAreas = async () => {
  const areasCollection = collection(firestore, "areas");
  const snapshot = await getDocs(areasCollection);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as AreaType));
};

export const useGetAreas = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });
};

const getAreaById = async (areaId: string) => {
  const areasCollectionRef = collection(firestore, "areas");
  const areaQuery = query(areasCollectionRef, where("areaId", "==", areaId)); // Query for the `areaId`
  const snapshot = await getDocs(areaQuery);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { ...doc.data() };
  }

  throw new Error(`Area with areaId ${areaId} not found`);
};

export const useGetAreaById = (areaId: string) => {
  return useQuery({
    queryKey: ["area", areaId],
    queryFn: () => getAreaById(areaId),
    enabled: !!areaId,
  });
};

const getUserById = async (userId: string) => {
  const userCollectionRef = collection(firestore, "users");
  const userQuery = query(userCollectionRef, where("uid", "==", userId));
  const snapshot = await getDocs(userQuery);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { ...doc.data() };
  }

  throw new Error(`User with userId ${userId} not found`);
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

const getUsersByArea = async (areaId: string) => {
  const usersCollection = collection(firestore, "users");
  const userQuery = query(usersCollection, where("areaId", "==", areaId)); // Query for the `areaId`
  const snapshot = await getDocs(userQuery);
  return snapshot.docs
    .map((doc) => ({ ...doc.data() } as UserType))
    .sort((a, b) =>
      a.refNo.localeCompare(b.refNo, undefined, { numeric: true })
    );
};

export const useGetUsersByArea = (areaId: string) => {
  return useQuery({
    queryKey: ["user-area", areaId],
    queryFn: () => getUsersByArea(areaId),
    enabled: !!areaId,
  });
};

export const createUser = async (user: UserType) => {
  const docId = `${user.uid}`; // Generate document ID
  const userDoc = doc(firestore, "users", docId); // Reference to the document
  await setDoc(userDoc, user); // Set the document data
  return user;
};

export const useCreateUser = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UserType) => createUser(user),
    onError,
    onSuccess: (user: UserType) => {
      queryClient.invalidateQueries({ queryKey: ["user-area", user.areaCode] });
      onSuccess();
    },
  });
};

const getPaymentsOfUser = async (userId: string) => {
  const paymentsCollection = collection(firestore, "payments");
  const paymentQuery = query(paymentsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(paymentQuery);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as PaymentType)
  );
};

export const useGetPaymentsOfUser = (userId: string) => {
  return useQuery({
    queryKey: ["user-payment", userId],
    queryFn: () => getPaymentsOfUser(userId),
    enabled: !!userId,
  });
};

export const editUser = async (
  userId: string,
  updatedData: Partial<UserType>
) => {
  const userDoc = doc(firestore, "users", userId);
  await updateDoc(userDoc, updatedData);
};

export const useEditUser = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; updatedData: Partial<UserType> }) =>
      editUser(data.userId, data.updatedData),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-area"] });
      onSuccess();
    },
  });
};

export const deleteUser = async (userId: string) => {
  const userDoc = doc(firestore, "users", userId);
  await deleteDoc(userDoc);
};

export const useDeleteUser = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-area"] });
      onSuccess();
    },
  });
};



// Fetch today's collection
export const fetchTodayCollection = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const q = query(
    collection(firestore, "payments"),
    where("paidAt", ">=", Timestamp.fromDate(startOfDay)),
    where("paidAt", "<=", Timestamp.fromDate(endOfDay))
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);
};

// Fetch monthly collection
export const fetchMonthCollection = async () => {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "short" }).toUpperCase();
  const currentYear = now.getFullYear();

  const q = query(
    collection(firestore, "payments"),
    where("month", "array-contains", currentMonth),
    where("year", "==", currentYear)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);
};

// Real-time updates for today's collection
export const subscribeToTodayCollection = (callback: (total: number) => void) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const q = query(
    collection(firestore, "payments"),
    where("paidAt", ">=", Timestamp.fromDate(startOfDay)),
    where("paidAt", "<=", Timestamp.fromDate(endOfDay))
  );

  return onSnapshot(q, (snapshot) => {
    const total = snapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
    callback(total);
  });
};

// Fetch monthly collection with history
// Fetch monthly collection with history
export const fetchMonthlyCollectionHistoryOptimized = async (year: number) => {
  const paymentsCollection = collection(firestore, "payments");

  const allDocs = await getDocs(paymentsCollection);
  const monthlyTotals = Array(12).fill(0); // Array to store total for each month

  allDocs.forEach((doc) => {
    const paymentData = doc.data();
    const paymentMonth = paymentData?.paymentMonth; // Month stored as an integer (0 = January, 1 = February, ...)
    const paymentYear = paymentData?.paymentYear;
    const amount = paymentData?.amount || 0;

    if (paymentYear === year && paymentMonth >= 0 && paymentMonth < 12) {
      // Add the payment amount to the corresponding month in the total array
      monthlyTotals[paymentMonth] += amount;
    }
  });

  return monthlyTotals.map((total, month) => ({
    month: new Date(year, month, 1).toLocaleString("default", { month: "short" }),
    year,
    total,
  }));
};


=======
export const addPayment = async (payment: PaymentType) => {
  const paymentCollection = collection(firestore, "payments");
  await addDoc(paymentCollection, payment);
  return payment;
};

export const useAddPayment = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: PaymentType) => addPayment(payment),
    onError,
    onSuccess: (payment: PaymentType) => {
      queryClient.invalidateQueries({
        queryKey: ["user-payment", payment.userId],
      });
      onSuccess();
    },
  });
};

export const editPayment = async (
  paymentId: string,
  updatedData: Partial<PaymentType>
) => {
  const paymentDoc = doc(firestore, "payments", paymentId);
  await updateDoc(paymentDoc, updatedData);
  return updatedData;
};

export const useEditPayment = (onSuccess: () => void, onError: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      paymentId: string;
      updatedData: Partial<PaymentType>;
    }) => editPayment(data.paymentId, data.updatedData),
    onError,
    onSuccess: (payment: Partial<PaymentType>) => {
      queryClient.invalidateQueries({
        queryKey: ["user-payment", payment.userId],
      });
      onSuccess();
    },
  });
};

export const deletePayment = async (paymentId: string, userId: string) => {
  const paymentDoc = doc(firestore, "payments", paymentId);
  await deleteDoc(paymentDoc);
  return { paymentId, userId };
};

export const useDeletePayment = (
  onSuccess: () => void,
  onError: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      paymentId,
      userId,
    }: {
      paymentId: string;
      userId: string;
    }) => deletePayment(paymentId, userId),
    onError,
    onSuccess: ({ userId }: { userId: string }) => {
      queryClient.invalidateQueries({
        queryKey: ["user-payment", userId],
      });
      onSuccess();
    },
  });
};

const getPaymentsOfArea = async (areaId: string) => {
  const paymentsCollection = collection(firestore, "payments");
  const paymentQuery = query(paymentsCollection, where("areaId", "==", areaId));
  const snapshot = await getDocs(paymentQuery);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as PaymentType)
  );
};

export const useGetPaymentsOfArea = (areaId: string) => {
  return useQuery({
    queryKey: ["area-payment", areaId],
    queryFn: () => getPaymentsOfArea(areaId),
    enabled: !!areaId,
  });
};

