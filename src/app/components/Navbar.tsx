"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../../../lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";
import { logout } from "../../../lib/actions/patient.actions";
import FetchUser from "./FetchUser";
import { log } from "console";
import { set } from "zod";
import Link from "next/link";

export const fetchUserData = async () => {
  const userData = await FetchUser()
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
  const path = usePathname();
  // const [userDetails, setUserDetails] = useState<any>(null);
  if (path && path.startsWith('/admin')) {
    return null; // Do not render the navbar on admin routes
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
  return (
    <div
      className={cn("relative inset-x-0 max-w-screen w-screen mx-auto z-100", className)}
    >
      <Menu setActive={setActive}>
        <div className="">
          <Image
            src={"/Mindsettler_logoFinal.png"}
            alt="Mindsettler Logo"
            width={120}
            height={80}
            className="absolute left-0 ml-4"
          />
        </div>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Login</HoveredLink>
            <HoveredLink href="/interface-design">ContactUs</HoveredLink>
            <HoveredLink href="/seo">Address</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
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
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
        <div className="absolute right-0 mr-4  ">
          {!user ? (
            <div className={`flex flex-col space-y-4  text-sm `}>
              <div className="rounded-xl border border-white/30 px-4 py-2">
                <Link href="/Login">Login</Link>
              </div>

            </div>
          ) : (

            <MenuItem setActive={setActive} active={active} item={user ? user.name : "Login"}>


              <div className={`flex flex-col space-y-4  text-sm ${user ? "" : "hidden"}`}>
                <div>{user ? user.name : "User"}</div>
                <div >{user ? user.email : "Email"}</div>
                <div className="">
                  <Button onClick={logoutButton}>Logout</Button>
                </div>
                {/* <div>Dashboard</div> */}
              </div>
            </MenuItem>
          )}





        </div>
      </Menu>
    </div>
  );
}
