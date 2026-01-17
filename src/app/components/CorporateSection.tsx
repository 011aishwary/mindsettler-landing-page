import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Users, Presentation, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import Link from "next/link";

const services = [
  {
    icon: Presentation,
    title: "Workshops",
    description: "Interactive sessions on stress management, emotional intelligence, and mental wellness.",
  },
  {
    icon: Users,
    title: "Group Sessions",
    description: "Team-focused discussions that build understanding and collective well-being.",
  },
  {
    icon: MessageSquare,
    title: "Consultation",
    description: "Tailored programs designed specifically for your organization's needs.",
  },
];

export const CorporateSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="corporate" className="pb-16 pt-10 lg:pb-24 lg:pt-16 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-medium text-sm tracking-wide uppercase">
              For Organizations
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary">
              Corporate Mental Wellness
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Support your team's mental health with our specialized corporate programs. 
              We help organizations build a culture of emotional well-being and resilience.
            </p>

            <div className="mt-8 space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:shadow-soft transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
                <Link href="/contact-us">
              <Button variant="secondary" className="group">
                Get Corporate Inquiry
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background decoration */}
              <motion.div
                initial={{ scale: 0.9, rotate: -30 , x: -30 , y:-40}}
                whileInView={{scale:1 , rotate:0 , x:0 , y:0}}
                transition={{ duration: 2, delay: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl transform rotate-3"
                // className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl transform rotate-3"
              >
              <div  />
                </motion.div>
              
              {/* Main card */}
              <div className="absolute inset-4 bg-card rounded-3xl shadow-medium border border-border/50 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <Building2 className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-3">
                  Empower Your Team
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create a workplace where mental health is valued, 
                  supported, and nurtured for everyone.
                </p>
                
                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 rounded-xl bg-lavender-soft">
                    <div className="text-2xl font-heading font-bold text-primary">60+</div>
                    <div className="text-xs text-muted-foreground">Min Sessions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-pink-soft">
                    <div className="text-2xl font-heading font-bold text-accent">100%</div>
                    <div className="text-xs text-muted-foreground">Confidential</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
