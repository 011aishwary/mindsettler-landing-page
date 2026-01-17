"use client"
import React, { useEffect, useState } from 'react'
import { Cross, XIcon } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../components/ui/input-otp"
import { decryptKey, encryptKey } from '../../../lib/utils'

const PasskeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(false)
    const [passkey, setPasskey] = useState('')
    const [error, setError] = useState('')
    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('admin_passkey') : null;

    useEffect(() => {
        const admin_passkey = encryptedKey && decryptKey(encryptedKey);
        if (admin_passkey === process.env.ADMIN_PASSKEY) {
            setOpen(false);
            router.push('/admin/true/panel');
        }
    }, [encryptedKey])


    const closeModal = () => {
        setOpen(false);
        router.push('/')
    }
    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // This should be securely handled in a real application

        if (passkey === process.env.ADMIN_PASSKEY) {
            // Grant access to admin features
            const ecryptedPasskey = encryptKey(passkey); // Simple encoding for demonstration
            console.log('Encrypted Passkey:', ecryptedPasskey);
            localStorage.setItem('admin_passkey', ecryptedPasskey);
            setOpen(false);
            router.push('/admin/true/panel');
        }
        else {
            setError('Invalid passkey. Please try again.');
        }
    }
    return (
        <div className='h-screen w-screen text-black absolute bg-white text-center mx-auto flex items-center justify-center'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className='bg-purple2 text-white px-15 rounded-xl text-2xl hover:scale-95 hover:bg-purple2/90 transition-all py-5 text-center'>Open Admin</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Admin Access Verification
                            <p className="absolute w-auto h-fit cursor-pointer top-0 right-0">
                                <XIcon
                                    onClick={() => closeModal()} /></p>

                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            TO access admin features, please enter your passkey.
                            <span className="text-center flex flex-col my-5 items-center justify-center">

                                <InputOTP value={passkey} onChange={(value) => setPasskey(value)} maxLength={6}>
                                    <InputOTPGroup className="gap-3">
                                        <InputOTPSlot className='border rounded-md' index={0} />
                                        <InputOTPSlot className='border rounded-md' index={1} />
                                        <InputOTPSlot className='border rounded-md' index={2} />
                                        <InputOTPSlot className='border rounded-md' index={3} />
                                        <InputOTPSlot className='border rounded-md' index={4} />
                                        <InputOTPSlot className='border rounded-md' index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                {error && <span className="text-red-500  text-center text-sm mt-4">{error}</span>}
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                        <AlertDialogAction
                            onClick={(e) => validatePasskey(e)} className='bg-purple2 w-full self-center'>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* <div className="bg-Primary-purple relative h-[40vh] w-[50vh] z-50 rounded-xl p-5 text-white font-light text-2xl">Enter Passkey</div> */}
        </div>
    )
}

export default PasskeyModal
