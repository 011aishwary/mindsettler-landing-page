"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { getUser, registerPatient } from "../../../../lib/actions/patient.actions"
import { Form, FormControl } from "../ui/Form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState, useEffect } from "react"
import { PatientFormValidation } from "../../../../lib/validation"
import { useRouter } from "next/navigation"
import { FormFeildType } from "@/app/Signup/page"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { GenderOptions } from "../../../../constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/Label"
import { SelectItem } from "../ui/select"
import FileUploader from "../ui/FileUploader"
import { User } from "../../../../types"
import { motion } from "framer-motion"

const RegisterForm = ({ user }: { user: User }) => {
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation) as any,
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            birthDate: new Date(),
            gender: "male" as const,
            address: "",
            occupation: "",
            allergies: "",
            pastMedicalHistory: "",
            identificationType: "",
            identificationNumber: "",
            identificationDocument: undefined,
            treatmentConsent: false,
            disclosureConsent: false,
            privacyConsent: false,
        },
    })

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const fetchUserData = async (userId: string) => {
        try {
            const fetchedUser = await getUser(userId);
            setUserDetails(fetchedUser);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserDetails(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        if (user?.$id) {
            fetchUserData(user.$id);
        }
    }, [user]);

    useEffect(() => {
        if (userDetails) {
            form.reset({
                name: userDetails.name ?? "",
                email: userDetails.email ?? "",
                phone: userDetails.phone?.toString() ?? "",
            });
        }
    }, [userDetails, form]);

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type
            })
            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append("fileName", values.identificationDocument[0].name);
        }
        if (values.identificationDocument && values.identificationDocument[0]?.size > 1024 * 1024) {
            alert('File size exceeds 1 MB. Please choose a smaller file.');
            setIsLoading(false); 
            return;
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
                allergies: values.allergies || "",
                pastMedicalHistory: values.pastMedicalHistory || "",
                phone: parseInt(values.phone.replace(/\D/g, '')),
            }

            await registerPatient(patientData);
            router.push(`/patient/${user.$id}/new-appointment`);
            console.log("User created successfully");

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-white">
            {!isLoadingUser && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="space-y-6 h-[90vh] mt-24 px-16 max-sm:px-0 flex flex-col w-full py-6"
                    >
                        <section 
                            className="flex flex-col items-start mb-6 w-full"
                        >
                            <h1 className="text-Primary-purple font-bold text-3xl md:text-4xl mb-1 drop-shadow-sm">Welcome</h1>
                            <h2 className="text-purple4 text-base md:text-lg">Let us know more about yourself</h2>
                        </section>

                        <section 
                            className="w-full"
                        >
                           <h2 className="text-purple4 text-xl font-semibold mb">Personal Information</h2>
                        </section>

                        <div 
                            className="w-full hover:shadow-sm transition-all duration-300 rounded-md"
                        >
                            <CustomFormField
                                fieldtype={FormFeildType.INPUT}
                                control={form.control}
                                name="name"
                                label="Full name"
                                placeholder="Enter your full name"
                                iconSrc="/assets/login.svg"
                                iconAlt="login"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    disabled={true}
                                    fieldtype={FormFeildType.INPUT}
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    placeholder="email@gmail.com"
                                    iconSrc="/assets/login.svg"
                                    iconAlt="email"
                                />
                            </div>
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.PHONE_INPUT}
                                    control={form.control}
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="+91 0123456789"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.DATE_PICKER}
                                    control={form.control}
                                    name="birthDate"
                                    label="Date of Birth"
                                    iconSrc="/assets/login.svg"
                                    iconAlt="email"
                                />
                            </div>
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.SKELETON}
                                    control={form.control}
                                    name="gender"
                                    label="Gender"
                                    renderSkeleton={(field) => (
                                        <FormControl>
                                            <RadioGroup 
                                                className="flex h-11 gap-4 xl:justify-between items-center"
                                                onValueChange={(value) => field.onChange(value)}
                                                defaultValue={field.value}
                                            >
                                                {GenderOptions.map((option) => (
                                                    <div key={option} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={option} id={option} className="text-purple-600 bg-white" />
                                                        <Label htmlFor={option} className="cursor-pointer text-gray-700 font-medium">
                                                            { option}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.INPUT}
                                    control={form.control}
                                    name="address"
                                    label="Address"
                                    placeholder="123 Main St, City, Country"
                                    iconSrc="/assets/buildings.svg"
                                    iconAlt="add"
                                />
                            </div>
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.INPUT}
                                    control={form.control}
                                    name="occupation"
                                    label="Occupation"
                                    placeholder="Your occupation"
                                    iconSrc="/assets/buildings.svg"
                                    iconAlt="buil"
                                />
                            </div>
                        </div>

                        <section 
                            className="pt-4 w-full"
                        >
                            <h2 className="text-purple4 text-xl font-semibold mb-4">Medical Information</h2>
                        </section>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.TEXTAREA}
                                    control={form.control}
                                    name="allergies"
                                    label="Allergies (if any)"
                                    placeholder="Peanuts, Pollen, etc."
                                    iconSrc="/assets/shield.svg"
                                    iconAlt="call"
                                />
                            </div>
                            <div 
                                className="flex-1 w-full hover:shadow-sm transition-all duration-300 rounded-md"
                            >
                                <CustomFormField
                                    fieldtype={FormFeildType.TEXTAREA}
                                    control={form.control}
                                    name="pastMedicalHistory"
                                    label="Past Medical History"
                                    placeholder="Describe any past medical conditions"
                                    iconSrc="/assets/stack.svg"
                                    iconAlt="medical history"
                                />
                            </div>
                        </div>

                        <section 
                            className="pt-4 w-full"
                        >
                            <h2 className="text-purple4 text-xl font-semibold mb-4">Identification and Verification</h2>
                        </section>

                        <div 
                            className="w-full hover:shadow-sm transition-all duration-300 rounded-md"
                        >
                            <CustomFormField
                                fieldtype={FormFeildType.SELECT}
                                control={form.control}
                                name="identificationType"
                                label="Identification Type"
                                placeholder="Select identification type"
                            >
                                {["Aadhaar", "Passport", "Driver's License", "Voter ID"].map((idType, i) => (
                                    <SelectItem key={idType + i} value={idType} className="text-purple3 cursor-pointer">
                                        {idType}
                                    </SelectItem>
                                ))}
                            </CustomFormField>
                        </div>

                        <div 
                            className="w-full hover:shadow-sm transition-all duration-300 rounded-md"
                        >
                            <CustomFormField
                                fieldtype={FormFeildType.INPUT}
                                control={form.control}
                                name="identificationNumber"
                                label="Identification Number"
                                placeholder="Enter your ID number"
                                iconSrc="/assets/chat.svg"
                                iconAlt="call"
                            />
                        </div>

                        <div 
                            className="w-full hover:shadow-sm transition-all duration-300 rounded-md"
                        >
                            <CustomFormField
                                fieldtype={FormFeildType.SKELETON}
                                control={form.control}
                                name="identificationDocument"
                                label="Upload your Identification Document"
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <FileUploader files={field.value} onChange={field.onChange} />
                                    </FormControl>
                                )}
                            />
                        </div>

                        <section 
                            className="pt-4 w-full"
                        >
                            <h2 className="text-purple4 text-xl font-semibold mb-4">Consent and Privacy</h2>
                        </section>

                        <div 
                            className="space-y-4 w-full p-4 rounded-lg hover:bg-purple-50/30 transition-colors duration-300"
                        >
                            <CustomFormField
                                fieldtype={FormFeildType.CHECKBOX}
                                control={form.control}
                                name="treatmentConsent"
                                label="I consent to treatment"
                            />
                            <CustomFormField
                                fieldtype={FormFeildType.CHECKBOX}
                                control={form.control}
                                name="disclosureConsent"
                                label="I consent to disclosure of information"
                            />
                            <CustomFormField
                                fieldtype={FormFeildType.CHECKBOX}
                                control={form.control}
                                name="privacyConsent"
                                label="I consent to privacy policy"
                            />
                        </div>

                        <div 
                            className="pt-6 w-full"
                        >
                            <SubmitButton 
                                className="w-full bg-Primary-purple hover:bg-purple2 hover:shadow-lg hover:shadow-purple-200 active:scale-[0.99] transition-all duration-300 h-12 text-lg" 
                                isLoading={isLoading}
                            >
                                Getting Started
                            </SubmitButton>
                        </div>

                        <div 
                            className="pb-8 pt-4 text-center text-sm text-gray-500 w-full"
                        >
                            MindSettler all rights reserved.
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default RegisterForm
