"use client"
import {  useEffect, useState } from "react";
import FetchUser from "./FetchUser";

export const fetchUserData = async () => {
    // console.log("User Data on Home Page:", userData);
    //   return userData;
    const [userDetails, setUserDetails] = useState<any>(null);
    useEffect(() => {
    const userData =  FetchUser().then(setUserDetails);
    }, []);

  console.log("User data fetched on home page." , userDetails);
  return userDetails;
//   useEffect(() => {
//     if (userData) {
//       console.log("User data fetched on home page:", userDetails);
//       console.log("User email:", userDetails.email);  // Access values here
//     }
//   }, [userDetails]);
};