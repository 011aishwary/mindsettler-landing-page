"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../../../lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";
import { logout } from "../../../lib/actions/patient.actions";
import FetchUser from "./FetchUser";
import Link from "next/link";
import {acc} from "../../app/appwrite/appwriteconfig";
import { ChevronDown, User2Icon, Menu as MenuIcon, X } from "lucide-react"
import { motion } from "framer-motion";
// import { useRouter } from "next/router";

export const  fetchUserData = async () => {
  const userData =await  FetchUser()
  return userData;
};


export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="fixed top-0" />

    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  // const route = useRouter();

  const path = usePathname();
  // const [userDetails, setUserDetails] = useState<any>(null);
  if (path && path.startsWith('/admin')) {
    return null; // Do not render the navbar on admin routes
  }
  else if (path && path.startsWith('/Login')) {
    return null; // Do not render the navbar on dashboard routes
  }
  else if (path && path.startsWith('/Signup')) {
    return null; // Do not render the navbar on dashboard routes
  }
  const logoutButton = async () => {
    setUser(null)
    await logout();

  }

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetchUserData().then(setUser);
  }, [path]);


  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Login", href: "/Login" },
    { label: "My Diary", href: "/MyDiary" },
    { label: "Appointment", href: "/new-appointment" },
    { label: "Contact", href: "/contact-us" },
    { label: "Resources", href: "/resources" },
  ];
  return (
    <>
      <div
        className={cn("relative inset-x-0 max-w-screen max-[750px]:hidden inline w-screen mx-auto  z-100", className)}
      >
        <Menu setActive={setActive}>
          <div className="">
            <Link href="/">
              <Image
                src={"/Mindsettler_logoFinal.png"}
                alt="Mindsettler Logo"
                width={120}
                height={80}
                className="absolute left-0 ml-4"
              />
            </Link>
          </div>

        {path && path == "/" ?<MenuItem setActive={setActive} active={active} item="Quick view">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="#about">About us</HoveredLink>
              <HoveredLink href="#process">Steps to book an appointment</HoveredLink>
              <HoveredLink href="#different">What make us Different</HoveredLink>
              <HoveredLink href="#address">Address</HoveredLink>
            </div>
          </MenuItem>:
          <HoveredLink href="/">Home</HoveredLink>
          }

          
          <HoveredLink href="/contact-us">Contact Us</HoveredLink>
          
          {/* <MenuItem setActive={setActive} active={active} item="Products">
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Login Portal"
                href="/Login"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Login to your MindSettler account to manage appointments and more"
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
              <ProductItem
                title="Schedule Appointment"
                href="/new-appointment"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Schedule your appointments in 10 seconds"
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem> */}
          <HoveredLink href="/MyDiary">My Diary</HoveredLink>
          <MenuItem setActive={setActive} active={active} item="Explore">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/resources">Blogs</HoveredLink>
              <HoveredLink href="/faq">FAQs</HoveredLink>
              <HoveredLink href="/engagement">Resources</HoveredLink>
              {path && path == "/" ? <HoveredLink href="/#corporate">Corporate Section</HoveredLink> :""}
              
            </div>
          </MenuItem>
          <div className="absolute right-0 mr-4 ">
            {!user ? (
              <div className="flex items-center justify-center text-sm">
                <div className="rounded-xl border border-white/30 relative px-4 py-2">
                  <Link href="/Login">Login</Link>
                </div>
              </div>
            ) : (
              <div className="text-center flex items-center mr-4">

                <span><User2Icon className="w-6 h-6 text-white mr-1" /></span>
                <MenuItem setActive={setActive} active={active} item={user ? user.name : "Login"}>


                  <div className={`flex flex-col space-y-4  items-start text-sm  ${user ? "" : "hidden"}`}>
                    <div>{user ? user.name : "User"}</div>
                    <div >{user ? user.email : "Email"}</div>
                    <div className="">
                      <Button onClick={logoutButton}>Logout</Button>
                    </div>
                  </div>
                </MenuItem>
                <ChevronDown className="w-4 h-4 text-white ml-1" />
              </div>
            )}
          </div>






        </Menu>
      </div>
      <div
        className={cn("relative  max-w-screen max-[750px]:flex flex-1 hidden w-screen mx-auto items-center justify-between bg-Primary-purple z-96 h-20 ", className)}
      >


        <div className="  ">
            <Link href="/">
              <Image
                src={"/Mindsettler_logoFinal.png"}
                alt="Mindsettler Logo"
                width={120}
                height={80}
                className="  ml-4"
              />
            </Link>
          </div>
        
        {/* Hamburger Menu */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mr-4 p-2"
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </motion.button>

        {/* Mobile Dropdown Menu */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute top-20 right-0 left-0 bg-Primary-purple border-t border-white/20 shadow-lg",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="flex flex-col p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: menuItems.length * 0.05 }}
                className="pt-2 border-t border-white/20 mt-2"
              >
                <div className="px-4 py-2 text-white text-sm">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-white/70 mb-3">{user.email}</div>
                  <Button onClick={logoutButton} className="w-full">Logout</Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        

      </div>

    </>
  );
}
