"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  ChevronDown,
  Cookie,
  CreditCard,
  Scale,
  UserCheck
} from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<"privacy" | "terms" | "consent">("privacy");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "privacy", label: "Privacy Policy", icon: Shield },
    { id: "terms", label: "Terms & Conditions", icon: Scale },
    { id: "consent", label: "Consent & Permissions", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-Primary-purple via-purple3 to-purple2 text-white py-16 sm:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10" />
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-5xl font-bold mb-4 font-heading"
          >
            Legal Information
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-purple-100 max-w-2xl mx-auto text-lg"
          >
            Transparency is key to our relationship. Here's how we handle your data, your rights, and our responsibilities.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 sm:py-12 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation - Sticky */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:w-1/4"
          >
            <div className={`bg-white rounded-2xl shadow-lg p-4 lg:sticky lg:top-24 transition-all duration-300`}>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-2">
                Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                        activeSection === section.id 
                          ? "bg-Primary-purple text-white shadow-md transform scale-105" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-Primary-purple"
                      }`}
                    >
                      <Icon size={18} className={activeSection === section.id ? "text-white" : "text-gray-400 group-hover:text-Primary-purple"} />
                      <span className="font-medium">{section.label}</span>
                      {activeSection === section.id && (
                        <motion.div layoutId="activeIndicator" className="ml-auto">
                          <ChevronRight size={16} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-800 font-medium mb-1">Last Updated</p>
                <p className="text-xs text-purple-600">January 17, 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Content Panel */}
          <motion.div 
            className="lg:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 min-h-[600px] border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === "privacy" && <PrivacyContent />}
                  {activeSection === "terms" && <TermsContent />}
                  {activeSection === "consent" && <ConsentContent />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll to Top helper could go here */}
    </div>
  );
}

// --- Content Components ---

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
    <div className="p-3 bg-purple-100 rounded-xl text-Primary-purple">
      <Icon size={32} />
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
  </div>
);

const PolicySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8 group">
    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 group-hover:text-Primary-purple transition-colors">
      <div className="w-1.5 h-1.5 rounded-full bg-Primary-purple opacity-50" />
      {title}
    </h3>
    <div className="text-gray-600 space-y-2 leading-relaxed pl-3.5 border-l-2 border-gray-100 group-hover:border-purple-200 transition-colors">
      {children}
    </div>
  </div>
);

const PrivacyContent = () => (
  <div>
    <SectionHeader title="Privacy Policy" icon={Shield} />
    
    <div className="prose max-w-none prose-purple">
      <p className="text-gray-600 mb-8 text-lg">
        Your privacy is extremely important to us. At MindSettler, we put significant thought, effort, tools, resources, and procedures in place to protect and safeguard your privacy.
      </p>

      <PolicySection title="Information Collection">
        <p>We may collect:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Personal Information:</strong> name, email, phone number, login credentials.</li>
          <li><strong>Session Information:</strong> booking details, preferences, session communication.</li>
          <li><strong>Health-Related Data:</strong> information shared during counseling sessions is treated with highest confidentiality.</li>
          <li><strong>Usage Data:</strong> how you interact with the website, chatbot, and services.</li>
        </ul>
      </PolicySection>

      <PolicySection title="How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To contact you about services, bookings, or updates.</li>
          <li>For billing and payment processing.</li>
          <li>To match you with the right Counselor and facilitate services.</li>
          <li>To monitor, supervise, and improve the Platform and services.</li>
          <li>To ensure safety and comply with legal obligations.</li>
        </ul>
      </PolicySection>
      
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
         <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold">
                 <Cookie size={16} />
                 <span>Cookies</span>
             </div>
             <p className="text-sm text-blue-600/80">
                 We use cookies to enhance user experience. You can adjust your browser settings to refuse cookies, though some features may be limited.
             </p>
         </div>
         <div className="bg-green-50 p-4 rounded-xl border border-green-100">
             <div className="flex items-center gap-2 mb-2 text-green-700 font-bold">
                 <Lock size={16} />
                 <span>Security</span>
             </div>
             <p className="text-sm text-green-600/80">
                 We employ industry-standard encryption and secure servers. While no system is 100% secure, we strive to protect your data zealously.
             </p>
         </div>
      </div>

      <PolicySection title="Third-Party Sharing">
        <p>We do not sell your personal data. Third-party providers may help facilitate our services under valid confidentiality agreements. We may disclose information as required by law to protect safety or comply with legal obligations.</p>
      </PolicySection>

      <PolicySection title="Children's Privacy">
        <p>Our services are available for children above 5 with parental consent, and adults. We do not knowingly collect information from children under 5 years of age.</p>
      </PolicySection>
    </div>
  </div>
);

const TermsContent = () => (
  <div>
    <SectionHeader title="Terms & Conditions" icon={FileText} />
    
    <div className="prose max-w-none">
      <p className="text-gray-600 mb-6 italic border-l-4 border-Primary-purple pl-4 py-2 bg-purple-50 rounded-r-lg">
        By accessing or using our Platform, you agree to comply with these Terms. If you do not agree, please discontinue use immediately.
      </p>

      <PolicySection title="Eligibility & Registration">
          <p>Services are available to users aged 5+ (with parental consent for minors). Users must provide accurate information to create accounts. You are responsible for maintaining the confidentiality of your account credentials.</p>
      </PolicySection>

      <PolicySection title="Payments & Refunds">
          <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Payment is required for therapy sessions (chat, audio, video, in-person).</li>
              <li>Prime & Essential Packages have specific refund policies detailed at checkout.</li>
              <li><strong>No refunds</strong> for no-shows, completed sessions, or mere dissatisfaction; however, therapist reassignment may be offered.</li>
              <li>Payments are processed via authorized secure gateways.</li>
          </ul>
      </PolicySection>

      <PolicySection title="Acceptable Use">
          <p>You agree to use the platform only for lawful purposes. You must not post abusive, illegal, offensive, or infringing content. MindSettler reserves the right to remove violating content and suspend accounts.</p>
      </PolicySection>

      <PolicySection title="Disclaimers">
          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm font-medium">
              <p className="mb-2">⚠️ <strong>Not for Emergencies:</strong> MindSettler is not a suicide helpline. If you are in a crisis, please contact local emergency services immediately.</p>
              <p>Information provided is for educational purposes and is not a substitute for professional medical advice.</p>
          </div>
      </PolicySection>

      <PolicySection title="Governing Law">
          <p>These Terms are governed by the laws of India. Courts in Delhi have exclusive jurisdiction over any disputes.</p>
      </PolicySection>
    </div>
  </div>
);

const ConsentContent = () => {
    const permissions = [
        {
            title: "Health Data Processing",
            desc: "Consent to collect and process health-related information shared during sessions for the purpose of providing mental health services.",
            required: true
        },
        {
            title: "Communication",
            desc: "Permission to contact you via email or phone regarding appointments, updates, and service-related notifications.",
            required: true
        },
        {
            title: "Audio/Video Sessions",
            desc: "Usage of camera and microphone during scheduled video consultation sessions.",
            required: true
        },
        {
            title: "AI Chatbot Interaction",
            desc: "Consent to interact with our AI support tools. Please note that AI responses are for support only and not medical diagnosis.",
            required: false
        },
        {
            title: "Anonymized Analytics",
            desc: "Permission to use anonymized session data to improve platform quality and service effectiveness.",
            required: false
        }
    ];

    return (
        <div>
            <SectionHeader title="Consent & Permissions" icon={UserCheck} />
            
            <p className="text-gray-600 mb-8">
                To provide you with the best mental health care and Platform experience, MindSettler requires certain permissions. Below is an overview of what you are consenting to by using our services.
            </p>

            <div className="space-y-4">
                {permissions.map((perm, idx) => (
                    <motion.div 
                        key={idx}
                        className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all shadow-sm hover:shadow-md bg-white"
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className={`flex-shrink-0 mt-1 ${perm.required ? "text-Primary-purple" : "text-gray-400"}`}>
                            {perm.required ? <CheckCircle size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-800">{perm.title}</h4>
                                {perm.required && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                        Required
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{perm.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Scale size={18} />
                    Revoking Consent
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                    You have the right to revoke optional consents at any time. For required consents, revocation may result in the inability to continue using certain core services. You can manage your preferences in your Account Settings or by contacting support.
                </p>
                <Link href="/contact-us" className="text-Primary-purple font-medium text-sm hover:underline">
                    Contact Privacy Officer &rarr;
                </Link>
            </div>
        </div>
    );
};
