"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { int, set, z } from "zod"
import Image from "next/image"
import { createUser } from "../../../../lib/actions/patient.actions"
import { Button } from "../ui/Button"
import { Form, FormControl } from "../ui/Form"
import { Input } from "../ui/Input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "../../../../lib/validation"
import { useRouter } from "next/navigation"
import { FormFeildType } from "@/app/Login/page"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { GenderOptions, PatientFormDefaultValues } from "../../../../constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/Label"
import { SelectItem } from "../ui/select"
import FileUploader from "../ui/FileUploader"
import { registerPatient } from "../../../../lib/actions/patient.actions";
import {useQRCode} from "next-qrcode";



const RegisterForm = ({ user }: { user: User }) => {
    const {Canvas} = useQRCode();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            birthDate: new Date(),
            gender: "male" as const,  // Match the union type
            address: "",
            occupation: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
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

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
                allergies: values.allergies || "",  // Provide default if optional in schema but required in API
                pastMedicalHistory: values.pastMedicalHistory || "",
                phone: parseInt(values.phone.replace(/\D/g, '')),
            }

            await registerPatient(patientData);

            // if (patient) {
            router.push(`/patient/${user.$id}/new-appointment`);
            console.log("User created successfully");
            // }


        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 relative flex h-[80vh] overflow-y-visible  my-10   mx-10 flex-col mb-10  md:max-w-[40vw] ">
                    <section className="flex flex-col items-start mb-5">
                        <h1 className="text-Primary-purple font-semibold">Welcome</h1>
                        <h2 className="text-purple4 text-sm">Let us know more about yourself</h2>
                    </section>
                    <section className="flex flex-col items-start mb-5">

                        <h2 className="text-purple4 text-xl">Personal Information</h2>
                    </section>
                    <CustomFormField
                        fieldtype={FormFeildType.INPUT}
                        control={form.control}
                        name="name"
                        label="Full name"
                        placeholder="Enter your full name"
                        iconSrc="/assets/login.svg"
                        iconAlt="login"
                    />
                    <div className="flex flex-col gap-6 lg:flex-row ">

                        <CustomFormField
                            fieldtype={FormFeildType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="email@gmail.com"
                            iconSrc="/assets/login.svg"
                            iconAlt="email"
                        />
                        <CustomFormField
                            fieldtype={FormFeildType.PHONE_INPUT}
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="+91 0123456789"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <CustomFormField
                            fieldtype={FormFeildType.DATE_PICKER}
                            control={form.control}
                            name="birthDate"
                            label="Date of Birth"
                            // placeholder=""
                            iconSrc="/assets/login.svg"
                            iconAlt="email"

                        />
                        <CustomFormField
                            fieldtype={FormFeildType.SKELETON}
                            control={form.control}
                            name="gender"
                            label="Gender"
                            renderSkeleton={(field) => {
                                return <FormControl>
                                    <RadioGroup className="flex h-8 gap-6 lg:justify-between"
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value}>
                                        {GenderOptions.map((option) => (
                                            <div key={option} className="flex items-center">
                                                <RadioGroupItem value={option} id={option} />
                                                <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>

                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row ">

                        <CustomFormField
                            fieldtype={FormFeildType.INPUT}
                            control={form.control}
                            name="address"
                            label="Address"
                            placeholder="123 Main St, City, Country"
                            iconSrc="/assets/buildings.svg"
                            iconAlt="add"
                        />
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
                    {/* <div className="flex flex-col gap-6 lg:flex-row ">

                        <CustomFormField
                            fieldtype={FormFeildType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency Contact Name"
                            placeholder="Gaurdians Name"
                            iconSrc="/assets/chat.svg"
                            iconAlt="call"
                        />
                        <CustomFormField
                            fieldtype={FormFeildType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency Contact Number"
                            placeholder="+91 0123456789"
                            iconSrc="/assets/chat.svg"
                            iconAlt="call"
                        />

                    </div> */}
                    <section className="flex flex-col items-start my-2">

                        <h2 className="text-purple4 text-xl">Medical Information</h2>
                    </section>
                    <div className="flex flex-col gap-6 lg:flex-row ">

                        <CustomFormField
                            fieldtype={FormFeildType.TEXTAREA}
                            control={form.control}
                            name="allergies"
                            label="Allergies (if any)"
                            placeholder="Peanuts, Pollen, etc."
                            iconSrc="/assets/shield.svg"

                            iconAlt="call"
                        />
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
                    <section className="flex flex-col items-start my-2">

                        <h2 className="text-purple4 text-xl">Identification and Verification</h2>
                    </section>
                    <CustomFormField
                        fieldtype={FormFeildType.SELECT}
                        control={form.control}
                        name="identificationType"
                        label="Identification Type"
                        placeholder="Aadhaar, Passport, etc."
                    // iconSrc="/assets/id-card.svg"
                    // iconAlt="id"
                    >
                        {["Aadhaar", "Passport", "Driver's License", "Voter ID"].map((idType, i) =>
                        (
                            <SelectItem key={idType + i} value={idType} className="text-purple3 flex cursor-pointer items-center gap-2 relative !important">

                                {idType}

                            </SelectItem>
                        ))}
                    </CustomFormField>
                    <CustomFormField
                        fieldtype={FormFeildType.INPUT}
                        control={form.control}
                        name="identificationNumber"
                        label="Identification Number"
                        placeholder="Enter your ID number"
                        iconSrc="/assets/chat.svg"
                        iconAlt="call"
                    />

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
                    <section className="flex flex-col items-start my-2">

                        <h2 className="text-purple4 text-xl">Consent and Privacy</h2>
                    </section>
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
                    <SubmitButton className="" isLoading={false} > Getting Started </SubmitButton>
                    <div className="h-40 w-full bg-white text-white ">
                        MindSettler all rights reserved.
                    </div>
                </form>
            </Form>
        </div>
    )
}


export default RegisterForm