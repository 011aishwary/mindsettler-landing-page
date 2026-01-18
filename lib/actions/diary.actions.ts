"use server";

import { AppwriteException, ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {
  DATABASE_ID,
  DIARY_COLLECTION_ID,
  ENDPOINT,
  databases,
} from "../appwrite.config";
import { DiaryEntry } from "../../types/appwrite.types";

const ensureAppwriteConfig = () => {
  const missing: string[] = [];
  if (!ENDPOINT) missing.push("NEXT_PUBLIC_ENDPOINT");
  if (!DATABASE_ID) missing.push("DATABASE_ID");
  if (!DIARY_COLLECTION_ID) missing.push("DIARY_COLLECTION_ID");

  if (missing.length) {
    throw new Error(`Missing Appwrite env vars: ${missing.join(", ")}`);
  }
};

const formatActionError = (error: unknown, action: string) => {
  if (error instanceof AppwriteException) {
    return `${action}: ${error.message} (code ${error.code})`;
  }
  if (error instanceof Error) {
    return `${action}: ${error.message}`;
  }
  return `${action}: unknown error`;
};

// CREATE DIARY ENTRY
export const createDiaryEntry = async (entry: {
  userId: string;
  title: string;
  content: string;
  privacy: string;
  entry_date: Date;
}) => {
  try {
    ensureAppwriteConfig();

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
    console.error("createDiaryEntry failed:", error);
    throw new Error(formatActionError(error, "Failed to create diary entry"));
  }
};

// GET USER DIARY ENTRIES
export const getUserDiaryEntries = async (userId: string) => {
  try {
    ensureAppwriteConfig();

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
    console.error("getUserDiaryEntries failed:", error);
    return [];
  }
};

// UPDATE DIARY ENTRY
export const updateDiaryEntry = async (
  entryId: string,
  updates: Partial<Pick<DiaryEntry, "title" | "content" | "privacy">>
) => {
  try {
    ensureAppwriteConfig();

    const updatedEntry = await databases.updateDocument(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      entryId,
      updates
    );

    return parseStringify(updatedEntry);
  } catch (error) {
    console.error("updateDiaryEntry failed:", error);
    throw new Error(formatActionError(error, "Failed to update diary entry"));
  }
};

// DELETE DIARY ENTRY
export const deleteDiaryEntry = async (entryId: string) => {
  try {
    ensureAppwriteConfig();

    await databases.deleteDocument(
      DATABASE_ID!,
      DIARY_COLLECTION_ID!,
      entryId
    );

    return true;
  } catch (error) {
    console.error("deleteDiaryEntry failed:", error);
    throw new Error(formatActionError(error, "Failed to delete diary entry"));
  }
};

// GET ALL SHARED DIARY ENTRIES (For Admin)
export const getSharedDiaryEntries = async () => {
  try {
    ensureAppwriteConfig();

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
    console.error("getSharedDiaryEntries failed:", error);
    return [];
  }
};

// GET PATIENT SHARED ENTRIES (Specific User)
export const getPatientSharedEntries = async (userId: string) => {
  try {
    ensureAppwriteConfig();

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
    console.error("getPatientSharedEntries failed:", error);
    return [];
  }
};
