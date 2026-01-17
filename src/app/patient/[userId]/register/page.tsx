import React from "react"
import { getUser } from "../../../../../lib/actions/patient.actions";
import RegisterPageContent from "./RegisterPageContent";

const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = await params;
    const user = await getUser(userId);
    
    return <RegisterPageContent user={user} />;
}

export default Register
