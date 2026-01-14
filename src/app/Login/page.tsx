"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {  z } from "zod"
import Image from "next/image"
import {Form} from "../components/ui/Form"
import CustomFormField from "../components/CustomFormField"
import SubmitButton from "../components/ui/SubmitButton"
import  { useEffect, useState } from "react"
import { LoginFormValidation } from "../../../lib/validation"
import { useRouter } from "next/navigation"
import { account } from "../../../lib/appwrite.config"
import Link from "next/link"
import {createCookieSession} from "../../../lib/actions/patient.actions"

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
const [user, setUser] = useState<any>(null);
//   useEffect(() => {
//     account.get()
//       .then((res) => setUser(res) )
//       .catch(() => router.push("/Login"));
//   }, []);

//   if (!user) return <p className="bg-Primary-purple w-100 h-100">Loading...</p>;

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({email,password}: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);
    console.log("Form submitted with:", {email, password});
    // preventDefault();

    try {
      const userLog = await account.createEmailPasswordSession(email.trim(), password);
      await createCookieSession(userLog);
    //   (await cookies()).set("a_session_" + process.env.PROJECT_ID, userLog.secret, {
    //               path: "/",
    //               httpOnly: true,
    //               sameSite: "strict",
    //               secure: true,
    //           });
    //   console.log("User logged in successfully:", userLog.userId);
    //   if (userLog) router.push(`/patient/${userLog.userId}/register`);
      if (userLog) router.push("/");
    //   router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }

    // try {
    //   const userData = {name,email,phone,password};
    //   const user = await createUser(userData);
    //   // auto-login after signup
    //   await account.createEmailPasswordSession(email, password);
    //   if (user) router.push(`/patient/${user.$id}/register`);

    //   console.log("User created successfully:", user);
    // } catch (error) {
    //   console.log(error);
      
    // }

  }
  return (
    <div className="flex relative mt-14 h-[90vh] overflow-hidden bg-white justify-between items-center min gap-10 w-screen ">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:scale-75 relative flex  mx-10 flex-col md:max-w-[40vw] flex-1">
        <section className="flex flex-col justify-start">
          <h1 className="text-Primary-purple font-semibold">Hi there 👋</h1>
          <h2 className="text-purple4">Schedule your first session</h2>
        </section>
        {/* <CustomFormField 
          fieldtype={FormFeildType.INPUT}
          control={form.control}
          name= "name"
          label = "Full name"
          placeholder="Enter your full name"
          iconSrc="/assets/login.svg"
          iconAlt="login"
        /> */}
        <CustomFormField 
          fieldtype={FormFeildType.INPUT}
          control={form.control}
          name= "email"
          label = "Email"
          placeholder="email@gmail.com"
          iconSrc="/assets/login.svg"
          iconAlt="email"
        />
        {/* <CustomFormField 
          fieldtype={FormFeildType.PHONE_INPUT}
          control={form.control}
          name= "phone"
          label = "Phone Number"
          placeholder="+91 0123456789"
        /> */}
        <CustomFormField 
          fieldtype={FormFeildType.INPUT}
          control={form.control}
          name= "password"
          label = "Password"
          placeholder="Enter your password"
          iconSrc="/assets/login.svg"
          iconAlt="password"
        />
        <SubmitButton isLoading={false} > Getting Started </SubmitButton>
      <div className="text-center flex justify-center items-center space-x-2">
        <span className="text-black">
          Already have an account?
        </span>
        <span className="">
          <Link href={"/Signup"}className="text-Primary-purple font-semibold ml-1 hover:scale-120 hover:text-Primary-purple/90 hover:underline">
          SignUp
          </Link> 
        </span>
      </div>
      </form>
    </Form>
      <div className="max-h-screen">
        <Image
          src="/LoginPage.jpeg"
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




