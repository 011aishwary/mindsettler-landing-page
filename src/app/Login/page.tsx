"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import Image from "next/image"
import { createUser } from "../../../lib/actions/patient.actions"
import { Button } from "../components/ui/Button"
import {Form} from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import CustomFormField from "../components/CustomFormField"
import SubmitButton from "../components/ui/SubmitButton"
import  { useState } from "react"
import { UserFormValidation } from "../../../lib/validation"
import { useRouter } from "next/navigation"

export enum FormFeildType {
  INPUT ='input',
  TEXTAREA= 'textarea',
  CHECKBOX= 'checkbox',
  PHONE_INPUT= 'phoneInput',
  SELECT = 'select',
  DATE_PICKER= 'datePicker',
  DATE_TIME_PICKER= 'dateTimePicker',
  SKELETON= 'skeleton',
}



const page = () => {
  // ...
  const  [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = {name,email,phone};
      const user = await createUser(userData);
      if (user) router.push(`/patient/${user.$id}/register`);

      console.log("User created successfully:", user);
    } catch (error) {
      console.log(error);
      
    }

  }
  return (
    <div className="flex relative h-[90vh] overflow-hidden bg-white justify-between items-center min gap-10 w-screen ">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative flex  mx-10 flex-col md:max-w-[40vw] flex-1">
        <section className="flex flex-col justify-start">
          <h1 className="text-Primary-purple font-semibold">Hi there 👋</h1>
          <h2 className="text-purple4">Schedule your first session</h2>
        </section>
        <CustomFormField 
          fieldtype={FormFeildType.INPUT}
          control={form.control}
          name= "name"
          label = "Full name"
          placeholder="Enter your full name"
          iconSrc="/assets/login.svg"
          iconAlt="login"
        />
        <CustomFormField 
          fieldtype={FormFeildType.INPUT}
          control={form.control}
          name= "email"
          label = "Email"
          placeholder="email@gmail.com"
          iconSrc="/assets/login.svg"
          iconAlt="email"
        />
        <CustomFormField 
          fieldtype={FormFeildType.PHONE_INPUT}
          control={form.control}
          name= "phone"
          label = "Phone Number"
          placeholder="+91 0123456789"
        />
        
        <SubmitButton isLoading={false} > Getting Started </SubmitButton>
      </form>
    </Form>
      <div className="max-h-screen">
        <Image
          src="/portrait.png"
          alt="loginimg"
          width={500}
          height={500}
          className="h-screen w-auto"
        />
      </div>
    </div>
    
  )
}




export default page



