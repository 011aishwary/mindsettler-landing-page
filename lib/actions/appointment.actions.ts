"use server";
import { ID } from "node-appwrite";
import {parseStringify} from "../utils";
import {APPOINTMENTS_COLLECTION_ID, DATABASE_ID, databases} from "../appwrite.config";

export const createAppointment = async (appointment : CreateAppointmentParams) => {
    try {
        console.log("Registering appointment...", DATABASE_ID , APPOINTMENTS_COLLECTION_ID , appointment , ID.unique());
        const newAppontment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            ID.unique(),
            appointment
            
        );
        return parseStringify(newAppontment);
            
            
        } catch (error) {
        console.log("Error registering patient:", error);
        throw error;
    }
}

export const getAppointment = async (appointmentId:string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId
        );
        return parseStringify(appointment);
    } catch (error) {
        console.log("Error fetching appointment:", error);
        throw error;
    }
}