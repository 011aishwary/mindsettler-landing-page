"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { number, set, z } from "zod"
import Image from "next/image"
import { createUser } from "../../../lib/actions/patient.actions"
import { Button } from "../components/ui/Button"
import { Form } from "../components/ui/Form"
import { Input } from "../components/ui/Input"
import CustomFormField from "../components/CustomFormField"
import SubmitButton from "../components/ui/SubmitButton"
import { useState, useEffect } from "react"
import { UserFormValidation } from "../../../lib/validation"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { account } from "../../../lib/appwrite.config"
import Link from "next/link"
import { acc } from "../../app/appwrite/appwriteconfig"
import { OAuthProvider } from "node-appwrite"
// import { User } from "node-appwrite/types/user"
export enum FormFeildType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneInput',
  SELECT = 'select',
  DATE_PICKER = 'datePicker',
  DATE_TIME_PICKER = 'dateTimePicker',
  SKELETON = 'skeleton',
}



const page = () => {
  // ...
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const [user, setUser] = useState<any>(null);
  //   useEffect(() => {
  //     account.get()
  //       .then(setUser)
  //       .catch(() => router.push("/Login"));
  //   }, []);

  //   if (!user) return <p>Loading...</p>;
  async function signupgoogle() {
    try {
      // FIX: Force localhost:3000 to prevent 127.0.0.1 cookie mismatches
      const origin = "http://localhost:3000"; 
      
      const res = await acc.createOAuth2Session(
        OAuthProvider.Google,
        `${origin}/auth-callback`,
        `${origin}/Signup`
      );
      console.log("Google Sign-In Response:", res);
    }
    catch (error) {
      console.log("Google Sign-In Error:", error);
    }
  }
  useEffect(() => {
    const getUser = async () => {
      const user = await account.get();
      console.log("User ID is:", user.$id);
      // Now you have the ID and can redirect to dynamic routes if needed
    };
    getUser();
  }, []);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone, password }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    console.log("Form submitted with:", { name, email, phone, password });

    try {
      const userData = { name, email, phone: Number(phone), password };
      const user = await createUser(userData);
      await new Promise(r => setTimeout(r, 500));
      await account.createEmailPasswordSession(email.trim(), password);

      if (user) router.push(`/patient/${user.$id}/register`);

      console.log("User created successfully:", user);
    } catch (error) {
      console.log(error);

    }

  }
  return (
    <div className="flex relative lg:h-screen  flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements - Fixed Position, No Pointer Events */}
      <div
        className="fixed top-0 left-0 w-96  h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl pointer-events-none animate-blob"
      />
      <div
        className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl pointer-events-none animate-blob animation-delay-2000"
      />

      {/* Left Side - Form (No Framer MotionWrapper) */}
      <div
            className="w-full lg:w-1/2 lg:pt-50 lg:overflow-scroll lg:h-full  flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-0 relative z-20"
      >
        <div className="w-full my-10 max-w-md">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-Primary-purple mb-2">Begin Your Journey</h1>
            <p className="text-sm sm:text-base text-purple4">Create your account and start your mental wellness journey today</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              
                <CustomFormField
                  fieldtype={FormFeildType.INPUT}
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Your name"
                  iconSrc="/assets/login.svg"
                  iconAlt="name"
                />
             

              
                <CustomFormField
                  fieldtype={FormFeildType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  iconSrc="/assets/login.svg"
                  iconAlt="email"
                />
           

                <CustomFormField
                  fieldtype={FormFeildType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                />
             
                <CustomFormField
                  fieldtype={FormFeildType.INPUT}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Create a secure password"
                  iconSrc="/assets/login.svg"
                  iconAlt="password"
                />
             
                <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                  <SubmitButton isLoading={isLoading}>Create Account</SubmitButton>
                </div>

              <button
                onClick={signupgoogle}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-Primary-purple hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Lock className="w-5 h-5 mr-2 text-Primary-purple" />
                Sign up with Google

              </button>

              <div className="relative my-6 sm:my-8 z-30">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-white via-pink-50 to-purple-50 text-gray-500">
                    Already a member?
                  </span>
                </div>
              </div>

                <p className="text-sm text-center relative z-30 text-gray-600">
                  Already have an account?{' '}
                  <span className="inline-block hover:scale-105 transition-transform duration-200">
                    <Link
                      href="/Login"
                      className="text-Primary-pink font-bold hover:text-Primary-purple/80 transition-colors duration-300 hover:underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  </span>
                </p>
            
            </form>
          </Form>

          {/* Footer Text */}
          <p className="text-xs sm:text-sm text-center text-gray-500 mt-6 sm:mt-8 relative z-30">
            By creating an account, you agree to our{' '}
            <Link href="#" className="text-Primary-purple hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-Primary-purple hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image (Hidden on Mobile, Visible on LG) */}
      <div
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-Primary-purple/10 to-pink-200/20 z-10 animate-in fade-in slide-in-from-right-10 duration-700"
      >
        {/* Decorative Elements */}
        <div
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1)_0%,transparent_50%)] animate-pulse"
        />

        {/* Image with Hover Animation */}
        <div className="relative z-10 w-full h-full transition-transform duration-500 ease-out hover:scale-105">
          <Image
            src="/Signup.jpg"
            alt="Start Your Journey"
            fill
            className="object-cover pointer-events-none"
            priority
          />
        </div>

        {/* Floating Cards Animation */}
        <div
          className="absolute top-10 z-12 left-10 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg pointer-events-none float hover:shadow-glow transition-shadow duration-300"
        >
          <p className="text-sm font-semibold text-Primary-purple">Get Started Today</p>
          <p className="text-xs text-gray-600">Your wellness awaits</p>
        </div>

        <div
          className="absolute bottom-10 z-12 right-10 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg pointer-events-none float hover:shadow-glow transition-shadow duration-300"
          style={{ animationDelay: "2s" }}
        >
          <p className="text-sm font-semibold text-Primary-purple">Free Consultation</p>
          <p className="text-xs text-gray-600">Book your first session</p>
        </div>
      </div>
    </div>
  )
}




export default page



