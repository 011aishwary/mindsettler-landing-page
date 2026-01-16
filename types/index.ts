/* eslint-disable no-unused-vars */

import { Patient } from "./appwrite.types";

declare type Appointment = {
  reason: string;
  schedule: Date ;
  status: Status;
  note: string | undefined;
};

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export type Status = "scheduled" | "pending" | "cancelled";
export type Gender = "male" | "female" | "other";
export declare interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  phone: number;
}
// export declare interface CreateUserParams {
//   userId: string,
//   email: string,
//   password: string,
//   name: string,

// }
// 
export declare type User = {
  $id: string;
  phone: number;
  name: string;
  email: string;
}


export declare interface RegisterUserParams extends Omit<CreateUserParams, 'password'> {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  
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
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
}

export declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  patname: string;
  time: string;
  // primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
  paymentType: string;
  paymentProof: File | undefined;

};


export declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  // timeZone: string;
  appointment: Appointment;
  type: string;
};
