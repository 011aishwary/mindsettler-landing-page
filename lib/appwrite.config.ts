import * as sdk from 'node-appwrite';

export const {
    API_KEY,
    DATABASE_ID,
    PROJECT_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENTS_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID:BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT

} = process.env;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT

const pro_id = process.env.PROJECT_ID
// console.log("Appwrite Endpoint:", pro_id);
const client = new sdk.Client()
const key = "standard_0cf877bef0eaec54c452da3cebc5c28612acc11e32ef07bd7468024e378f83a13a4f86b8365a6dc4f5f6b0181c463033692aa8f77d29ecb23ea2da7ba579d344917940e9d19ba687c84e643258c935a198e42715b5634067c792c70edf8b8ae943d7e1bc1a491e3ffebdac16abdb9e15215e48b3d3fed7fe4b469e8838c8c756";

client.setEndpoint(endpoint!).setProject("695ea265002a468182f5").setKey(key!);

export const account = new sdk.Account(client);
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client); 
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
