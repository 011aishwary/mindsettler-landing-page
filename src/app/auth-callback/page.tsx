"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { acc } from "../../app/appwrite/appwriteconfig"; // Make sure to import your account instance specific to your project

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const maxRetries = 5;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          console.log(`Checking session (Attempt ${attempt + 1}/${maxRetries})...`);
          
          // 1. Try to get the user
          const user = await acc.get();
          
          if (user) {
            console.log("Success! User authenticated:", user.$id);
            router.push(`/patient/${user.$id}/register`);
            return; // Stop the loop and exit
          }
        } catch (error) {
          console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
          attempt++;
          
          // 2. Wait 1 second before trying again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 3. If we get here, all attempts failed
      console.error("Auth check failed after multiple attempts.");
      router.push("/Signup?error=oauth_failed");
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Verifying login...</p>
      {/* You can add a loading spinner here */}
    </div>
  );
}