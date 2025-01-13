import { firestore } from "@/config/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaType, UserType } from "@/types/types";

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
  const userQuery = query(usersCollection, where("areaId", "==", areaId));
  const snapshot = await getDocs(userQuery);
  return snapshot.docs.map((doc) => ({ ...doc.data() } as UserType));
};

export const useGetUsersByArea = (areaId: string) => {
  return useQuery({
    queryKey: ["user-area", areaId],
    queryFn: () => getUsersByArea(areaId),
    enabled: !!areaId,
  });
};

export const createUser = async (user: UserType) => {
  const userCollection = collection(firestore, "users");
  await addDoc(userCollection, user);
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
