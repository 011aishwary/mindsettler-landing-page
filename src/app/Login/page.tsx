"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Form } from "../components/ui/Form"
import CustomFormField from "../components/CustomFormField"
import SubmitButton from "../components/ui/SubmitButton"
import { useEffect, useState } from "react"
import { LoginFormValidation } from "../../../lib/validation"
import { useRouter } from "next/navigation"
import { account } from "../../../lib/appwrite.config"
import Link from "next/link"
import { createCookieSession } from "../../../lib/actions/patient.actions"
import { motion } from "framer-motion"
import { useToast } from "../../../hooks/use-toast"

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
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
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
    } catch (err: any) {
      console.log(err);
      setError("Invalid email or password. Please try again.");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Invalid email or password. Please try again.",
      });
      setIsLoading(false);
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
    <div className="flex relative flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements - Fixed Position, No Pointer Events */}
      <motion.div
        className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl pointer-events-none"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left Side - Form (No Framer MotionWrapper) */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-0 relative z-20"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-Primary-purple mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-purple4">Log in to schedule your consultation with our expert consultants</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* Email Field */}
              <div
                className="relative z-30"
              >
                <CustomFormField
                  fieldtype={FormFeildType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  iconSrc="/assets/login.svg"
                  iconAlt="email"
                />
              </div>

              {/* Password Field */}
              <div
                className="relative z-30"
              >
                <CustomFormField
                  fieldtype={FormFeildType.INPUT}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  iconSrc="/assets/login.svg"
                  iconAlt="password"
                />
              </div>

              {error && (
                <div
                  className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200"
                >
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div
                className="relative z-30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <SubmitButton isLoading={isLoading}>Getting Started</SubmitButton>
              </div>

              {/* Divider */}
              <div
                className="relative my-6 sm:my-8 z-30"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-white via-pink-50 to-purple-50 text-gray-500">
                    New to MindSettler?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div
                className="text-center relative z-30"
              >
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <span
                    className="inline-block hover:scale-105 transition-transform duration-200"
                  >
                    <Link
                      href="/Signup"
                      className="text-Primary-pink font-bold hover:text-Primary-purple/80 transition-colors duration-300 hover:underline underline-offset-4"
                    >
                      Create Account
                    </Link>
                  </span>
                </p>
              </div>
            </form>
          </Form>

          {/* Footer Text */}
          <p
            className="text-xs sm:text-sm text-center text-gray-500 mt-6 sm:mt-8 relative z-30"
          >
            By logging in, you agree to our{' '}
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
      <motion.div
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-Primary-purple/10 to-pink-200/20 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Decorative Elements */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        {/* Image with Hover Animation */}
        <motion.div
          className="relative z-10 w-full h-full "
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src="/Loginpagr1.jpg"
            alt="Consultant"
            fill
            className="object-cover pointer-events-none"
            priority
          />
        </motion.div>

        {/* Floating Cards Animation */}
        <motion.div
          className="absolute z-10 top-10 left-10 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg pointer-events-none"
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-sm font-semibold text-Primary-purple">Expert Consultants</p>
          <p className="text-xs text-gray-600">Available 24/7</p>
        </motion.div>

        <motion.div
          className="absolute z-10 bottom-10 right-30 bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-lg pointer-events-none"
          animate={{
            y: [0, 10, 0],
            rotate: [2, -2, 2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <p className="text-sm font-semibold text-Primary-purple">Secure & Confidential</p>
          <p className="text-xs text-gray-600">Your privacy matters</p>
        </motion.div>
      </motion.div>
    </div>
  )
    
  
}




export default page




