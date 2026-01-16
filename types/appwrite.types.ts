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
  identificationDocument: FormData | undefined;
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
  paymentProof: FormData | undefined;
  cancellationReason: string | null;
}
export type Status = "pending" | "scheduled" | "cancelled";