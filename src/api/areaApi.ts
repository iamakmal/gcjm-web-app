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
