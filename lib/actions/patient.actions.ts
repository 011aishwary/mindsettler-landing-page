"use server";
import { ID, Query } from "node-appwrite";
import {BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users} from "../appwrite.config";
import {parseStringify} from "../utils"
import {InputFile} from "node-appwrite/file";



export const createUser = async (user:CreateUserParams) => {
    try {
        const newUser = await users.create({
            userId: ID.unique(),
            email: user.email,
            phone: String(user.phone),
            password: undefined,
            name: user.name,
        });
        console.log("New user created:", {newUser});    
        return parseStringify(newUser);
        
    } catch (error : any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list({
                queries: [Query.equal("email", user.email)]
            });
            return existingUser?.users[0];
        }
        throw error; // Re-throw if not a 409 error
    }
}

export const getUser = async (userId:string) => {
    try {
        const user = await users.get({userId});
        return parseStringify(user);
    } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
    }   
}
export const getPatient = async (userId:string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", userId)]

        );
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log("Error fetching user:", error);
        throw error;
    }   
}

export const registerPatient = async ({identificationDocument , ...patient}: RegisterUserParams) => {
    try {
        let file;
        if(identificationDocument){
            const inputFIle = InputFile.fromBuffer(
                identificationDocument?.get('BlobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFIle);
        }
        

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                userId: patient.userId,
                name: patient.name,
                email: patient.email,
                phone: parseInt(String(patient.phone).replace(/\D/g, '')) || 0,
                birthDate: patient.birthDate,
                gender: patient.gender,
                address: patient.address,
                occupation: patient.occupation,
                emergencyContactName: patient.emergencyContactName,
                emergencyContactNumber: patient.emergencyContactNumber,
                allergies: patient.allergies,
                pastMedicalHistory: patient.pastMedicalHistory,
                identificationType: patient.identificationType,
                identificationNumber: patient.identificationNumber,
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl : `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                treatmentConsent: patient.treatmentConsent,
                disclosureConsent: patient.disclosureConsent,
                privacyConsent: patient.privacyConsent,
            });
{

}        
    } catch (error) {
        console.log("Error registering patient:", error);
        throw error;
    }
}