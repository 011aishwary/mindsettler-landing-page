import React from "react"
import { getUser, getPatient } from "../../../../../lib/actions/patient.actions";
import RegisterPageContent from "./RegisterPageContent";
import { redirect } from "next/navigation";

const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const user = await getUser(userId);

    let patient = null;
    try {
        patient = await getPatient(userId);
    } catch (error) {
        // User not registered as patient yet
    }

    if (patient) {
        redirect(`/`);
    }
    
    return <RegisterPageContent user={user} />;
}

export default Register
