"use server";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {
  DATABASE_ID,
  DIARY_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { DiaryEntry } from "../../types/appwrite.types";

// CREATE DIARY ENTRY
export const createDiaryEntry = async (entry: {
  userId: string;
  title: string;
  content: string;
  privacy: string;
  entry_date: Date;
}) => {
  try {
    const newEntry = await databases.createDocument(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      ID.unique(),
      {
        ...entry,
        entry_date: entry.entry_date.toISOString(), // Ensure Appwrite compatible format
      }
    );

    return parseStringify(newEntry);
  } catch (error) {
    console.error("An error occurred while creating a diary entry:", error);
    throw error;
  }
};

// GET USER DIARY ENTRIES
export const getUserDiaryEntries = async (userId: string) => {
  try {
    const entries = await databases.listDocuments(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.orderDesc("entry_date"), // Sort by entry date, newest first
      ]
    );

    return parseStringify(entries.documents);
  } catch (error) {
    console.error("An error occurred while fetching diary entries:", error);
    return [];
  }
};

// UPDATE DIARY ENTRY
export const updateDiaryEntry = async (
  entryId: string,
  updates: Partial<Pick<DiaryEntry, "title" | "content" | "privacy">>
) => {
  try {
    const updatedEntry = await databases.updateDocument(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      entryId,
      updates
    );

    return parseStringify(updatedEntry);
  } catch (error) {
    console.error("An error occurred while updating the diary entry:", error);
    throw error;
  }
};

// DELETE DIARY ENTRY
export const deleteDiaryEntry = async (entryId: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      entryId
    );

    return true;
  } catch (error) {
    console.error("An error occurred while deleting the diary entry:", error);
    throw error;
  }
};

// GET ALL SHARED DIARY ENTRIES (For Admin)
export const getSharedDiaryEntries = async () => {
  try {
    const entries = await databases.listDocuments(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      [
        Query.equal("privacy", ["shared"]),
        Query.orderDesc("entry_date"),
      ]
    );

    return parseStringify(entries.documents);
  } catch (error) {
    console.error("An error occurred while fetching shared diary entries:", error);
    return [];
  }
};

// GET PATIENT SHARED ENTRIES (Specific User)
export const getPatientSharedEntries = async (userId: string) => {
  try {
    const entries = await databases.listDocuments(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.equal("privacy", "shared"),
        Query.orderDesc("entry_date"),
      ]
    );

    return parseStringify(entries.documents);
  } catch (error) {
    console.error("An error occurred while fetching patient diary entries:", error);
    return [];
  }
};
