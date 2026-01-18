"use server";

import { ID, Query } from "node-appwrite";
import { DATABASE_ID, databases, CONTACT_COLLECTION_ID } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createContactMessage = async (contact: { name: string; email: string; message: string }) => {
  try {
    const newContact = await databases.createDocument(
      DATABASE_ID!,
      CONTACT_COLLECTION_ID!,
      ID.unique(),
      contact
    );

    return parseStringify(newContact);
  } catch (error) {
    console.error("An error occurred while creating a new contact message:", error);
    throw error; // Let the UI handle the error display
  }
};

export const getContactMessages = async () => {
  try {
    const contacts = await databases.listDocuments(
      DATABASE_ID!,
      CONTACT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    return parseStringify(contacts.documents);
  } catch (error) {
    console.error("An error occurred while fetching contact messages:", error);
    return [];
  }
};
