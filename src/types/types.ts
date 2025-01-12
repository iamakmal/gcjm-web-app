import { Timestamp } from "firebase/firestore";

export interface AreaType {
  areaId: string;
  areaCode: string;
  name: string;
  shortName: string;
  totalUsers?: number;
  createAt: Timestamp;
}

export interface UserType {
  uid: string;
  refNo: string;
  name: string;
  NIC: string;
  address: string;
  areaCode: string;
  areaId: string;
  contactNo: string;
  lastPayment?: number;
  lastPaymentDate?: string;
  subscription: string;
}
