import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'

const Footer = () => {
    return (
        <>
            <footer id='address' className="relative flex flex-col sm:flex-row items-start justify-between bg-Primary-purple text-blueGray p-10 gap-10">
                {/* <nav className='flex flex-col w-full md:w-auto gap-2'>
                    <h6 className="text-xl font-semibold mb-2">Services</h6>

                    <Link href="#corporate" className="link link-hover hover:text-white transition-colors">Corporate</Link>
                    <Link href="/" className="link link-hover hover:text-white transition-colors">Design</Link>
                    <Link href="/" className="link link-hover hover:text-white transition-colors">Marketing</Link>
                    <Link href="/" className="link link-hover hover:text-white transition-colors">Advertisement</Link>
                </nav> */}
                <nav className='flex flex-col w-full md:w-1/3 gap-3'>
                    <h6 className="text-xl font-semibold mb-2 text-white">Company</h6>
                    <Link href="#about" className="hover:text-white transition-colors">About us</Link>
                    <Link href="/contact-us" className="hover:text-white transition-colors">Contact</Link>
                    <Link href="#corporate" className="hover:text-white transition-colors">Corporate Services</Link>
                    <Link href="/" className="hover:text-white transition-colors">Press kit</Link>
                </nav>
                <nav className='flex flex-col w-full md:w-1/3 gap-3'>
                    <h6 className="text-xl font-semibold mb-2 text-white">Legal</h6>

                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Terms of use</Link>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy policy</Link>
                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Cookie policy</Link>
                </nav>
                <div className='flex flex-col w-full md:w-1/3 gap-2 items-start md:items-end'>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6213013647402!2d72.78249027497944!3d21.16746398300065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d002ebc63c3%3A0x4947cdf510882b9a!2sSVNIT%20Gate%201!5e0!3m2!1sen!2sin!4v1768642783682!5m2!1sen!2sin" 
                        className="w-full max-w-[300px] h-[200px] rounded-lg border-0"
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </footer>
            <footer className="relative bg-Primary-purple text-blueGray border-white/10 border-t px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <aside className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
                    <Image
                        src="/Mindsettler_logoFinal.png"
                        alt="MindSettler Logo"
                        width={120}
                        height={40}
                        className="opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <p className="text-sm">
                        © 2024 MindSettler. All rights reserved.
                        <br />
                        Providing authentic psycho education
                    </p>
                </aside>
                <nav>
                    <div className="flex gap-6">
                        <Link href="https://www.instagram.com/mindsettlerbypb/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                            </svg>
                        </Link>
                        <Link href="https://twitter.com/mind_settler" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                            </svg>

                        </Link>
                        
                        <Link href="https://www.facebook.com/mindsettler" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors transform hover:scale-110">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="fill-current">
                                <path
                                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                            </svg>
                        </Link>
                    </div>
                </nav>
            </footer>
        </>
    )
}

export default Footer
