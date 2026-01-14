"use server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as sdk from "node-appwrite";


export default async function FetchUser() {
  // 1. Setup Appwrite Client
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.PROJECT_ID?.toLowerCase()!);

  // 2. Get the session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(`a_session_${process.env.PROJECT_ID?.toLowerCase()}`);
  if (!sessionCookie) {
    return; // Security fallback
  }

  // 3. Authorize the Client with the session
  client.setSession(sessionCookie.value);

  const account = new sdk.Account(client);

  try {
    // 4. Fetch the User from Appwrite
    const user = await account.get(); // <--- GETS EVERYTHING (Email, Name, ID)
    console.log("Fetched user:", user);
    
    return (
      user
    );
  } catch (error) {
    console.error("Session expired:", error);
    redirect("/Login");
  }
}
