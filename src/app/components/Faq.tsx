import RollingBox from "./rollingBox";

import React from 'react'

const faqs = [
    { id: 1, question: "What happens in a session?", answer: "Each 60-minute session is a confidential conversation where we explore your thoughts, feelings, and challenges. We use structured psycho-education techniques to help you understand patterns and develop coping strategies. The first session focuses on understanding your needs and setting a foundation for your journey." },
    { id: 2, question: "Is everything I share confidential?", answer: "Absolutely. Confidentiality is the cornerstone of our practice. Everything discussed in sessions remains strictly between you and your counselor. We take your privacy extremely seriously, and you must acknowledge our confidentiality policy before your first session." },
    { id: 3, question: "How much do sessions cost?", answer: "Session pricing is designed to be accessible while reflecting the quality of personalized guidance you receive. Please contact us directly for current pricing details. Payment can be made via UPI or cash before each session." },
    { id: 4, question: "How do I book my first session?", answer: "Simply click 'Book a Session' on our website, choose between online or in-studio, select an available time slot, and complete the simple payment process. You'll receive a confirmation with all the details you need." },

    { id: 5, question: "What's the difference between online and in-studio sessions?", answer: "Both options provide the same quality of care. Online sessions offer convenience from your own space via secure video call. In-studio sessions take place in our calm, purpose-designed environment. Choose whatever feels most comfortable for you." },
    { id: 6, question: 'What if I need to cancel or reschedule?', answer: 'We understand life can be unpredictable. Please notify us at least 24 hours in advance if you need to reschedule. Note that we have a non-refund policy, so cancellations may not be eligible for refunds.' }


]

const Faq = () => {
    return (
        <div className="bg-cloudy-Apple min-h-fit w-screen py-2">
            <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
                FAQ
            </div>
            <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                Common Questions
            </h2>
            <div className="text-purple3 relative  text-center max-w-[60vw] mx-auto mb-12 text-md font-medium leading-relaxed">
                Find answers to frequently asked questions about MindSettler and our services.
            </div>
            <div className="flex flex-col justify-center items-center h-fit w-screen gap-2">
                {faqs.map((faq) => {
                    return (
                        <RollingBox
                            key={faq.id}
                            frontText={faq.question}
                            topText={faq.answer}
                        />
                    )

                }
                )}
            </div>
            <div className="relative w-screen text-center my-12 mx-auto ">
                <span className="text-gray-700">Still have questions?
                </span>
                <span className=" text-Primary-pink">Contact us!</span>
            </div>

        </div>
    )
}

export default Faq
