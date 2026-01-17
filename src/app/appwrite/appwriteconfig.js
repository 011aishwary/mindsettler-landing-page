// import {Account ,Client} from 'appwrite';

const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT) // Your Appwrite Endpoint
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID); // Your project ID

export const acc = new Account(client);