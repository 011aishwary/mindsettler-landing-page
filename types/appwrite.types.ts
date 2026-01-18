import { Models } from "node-appwrite";
import { Gender } from "./index";


export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: number;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  // primaryPhysician: string;
  // insuranceProvider: string;
  // insurancePolicyNumber: string;
  allergies: string | undefined;
  // currentMedication: string | undefined;
  // familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: string | undefined;
  privacyConsent: boolean;
  disclosureConsent: boolean;
  treatmentConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient:   string;
  schedule: Date;
  status: Status;
  time: string;
  patname: string;
  // primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  paymentType: string;
  paymentProof: string | undefined;
  cancellationReason: string | null;
}
export interface DiaryEntry extends Models.Document {
  userId: string;
  title: string;
  content: string;
  privacy: "private" | "shared";
  entry_date: Date;
}

export interface ContactMessage extends Models.Document {
  name: string;
  email: string;
  message: string;
}

export type Status = "pending" | "scheduled" | "cancelled";