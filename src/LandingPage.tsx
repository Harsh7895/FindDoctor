import {
  ArrowRight,
  Calendar,
  Clock,
  MessageSquare,
  Search,
  Shield,
  Stethoscope,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { CursorFollower } from "@/components/cursor-follower";
import { MobileMenu } from "@/components/mobile-menu";
import { useMobile } from "@/hooks/use-mobile";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMobile();

  // Refs for scroll animations
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if sections are in view
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const howItWorksInView = useInView(howItWorksRef, {
    once: true,
    amount: 0.2,
  });
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.2,
  });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  // Parallax effect for hero image
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Features", href: "features" },
    { name: "How It Works", href: "how-it-works" },
    { name: "Testimonials", href: "testimonials" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: any) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const stepVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: any) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  const testimonialVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: any) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const floatingAnimation = {
    y: ["-10px", "10px", "-10px"],
    transition: {
      duration: 5,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      ease: "easeInOut",
    },
  };

  const gradientAnimation = {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 10,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
      ease: "linear",
    },
  };

  const features = [
    {
      icon: Calendar,
      title: "Fast-Track Appointments",
      description:
        "Get priority slots with partnered doctors, reducing wait times significantly.",
    },
    {
      icon: Search,
      title: "Disease-Based Smart Matching",
      description:
        "Our AI suggests the best doctors based on your symptoms, specialization, and success rates.",
    },
    {
      icon: Clock,
      title: "Real-Time Availability",
      description:
        "See which doctors are available right now and book instantly without phone calls.",
    },
    {
      icon: MessageSquare,
      title: "Instant Chat",
      description:
        "Chat with the clinic or medical assistant before booking to discuss your symptoms.",
    },
    {
      icon: Shield,
      title: "Smart Appointment Dashboard",
      description:
        "Track appointments, prescriptions, and get automatic reminders for follow-ups or tests.",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Enter Your Symptoms",
      description:
        "Describe your symptoms or condition in the app, and our AI will analyze them.",
    },
    {
      number: 2,
      title: "Get Matched",
      description:
        "Our system matches you with the best specialists for your specific condition.",
    },
    {
      number: 3,
      title: "Book Instantly",
      description:
        "View real-time availability and book your appointment with just a few taps.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      text: "I found a specialist for my condition in minutes. The fast-track appointment saved me weeks of waiting!",
    },
    {
      name: "Michael Chen",
      role: "Patient",
      text: "The chat feature let me discuss my symptoms before booking. I felt much more comfortable knowing I was seeing the right doctor.",
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      text: "The follow-up reminders are a game-changer. I never miss an appointment or medication refill now.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col min-w-screen">
      {!isMobile && <CursorFollower />}

      {/* Navigation */}
      <motion.header
        className={`sticky top-0 z-40 w-full flex justify-center border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isScrolled ? "bg-background/95 shadow-md" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <Stethoscope className="h-6 w-6 text-teal-600" />
              </motion.div>
              <motion.span
                className="inline-block font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                DocFinder
              </motion.span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.nav
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const element = document.getElementById(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {link.name}
                </Button>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Login
                </Button>
              </motion.div>
            </motion.nav>
          </div>

          {/* Mobile Navigation */}
          <MobileMenu links={navLinks} />
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-50 overflow-hidden flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                    variants={itemVariants}
                  >
                    Find the Right Doctor in Seconds
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                    variants={itemVariants}
                  >
                    DocFinder matches you with the best specialists based on
                    your symptoms, with fast-track appointments and real-time
                    availability.
                  </motion.p>
                </motion.div>
                <motion.div
                  className="flex flex-col sm:flex-row gap-2"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 relative overflow-hidden group">
                      <motion.span
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                      <span className="relative z-10">Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center mt-8 lg:mt-0"
                style={isMobile ? {} : { y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div
                  className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-xl"
                  animate={isMobile ? {} : floatingAnimation}
                >
                  <img
                    src="/hero-image.png?height=600&width=500"
                    alt="Doctor consultation app interface"
                    className="w-full object-contain"
                    style={{ aspectRatio: "500/600" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    animate={{
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center"
          id="features"
          ref={featuresRef}
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={
                featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    featuresInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Key Features
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    featuresInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Why Choose DocFinder?
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    featuresInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Our app goes beyond just listing doctors. We're
                  revolutionizing how you find and book medical care.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-xl"
                  custom={i}
                  initial="hidden"
                  animate={featuresInView ? "visible" : "hidden"}
                  variants={featureCardVariants}
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 transform scale-x-0 transition-transform group-hover:scale-x-100"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-teal-50 flex justify-center"
          id="how-it-works"
          ref={howItWorksRef}
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={
                howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    howItWorksInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Simple Process
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    howItWorksInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  How DocFinder Works
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    howItWorksInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Finding the right doctor has never been easier. Just follow
                  these simple steps.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  custom={i}
                  initial="hidden"
                  animate={howItWorksInView ? "visible" : "hidden"}
                  variants={stepVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700"
                    animate={isMobile ? {} : pulseAnimation}
                  >
                    <span className="text-2xl font-bold">{step.number}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center"
          id="testimonials"
          ref={testimonialsRef}
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={
                testimonialsInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 50 }
              }
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    testimonialsInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Testimonials
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    testimonialsInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  What Our Users Say
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    testimonialsInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Don't just take our word for it. Here's what people are saying
                  about DocFinder.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  className="rounded-lg border bg-background p-6 shadow-sm"
                  custom={i}
                  initial="hidden"
                  animate={testimonialsInView ? "visible" : "hidden"}
                  variants={testimonialVariants}
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.img
                      src="/placeholder.svg?height=100&width=100"
                      alt="User avatar"
                      className="h-12 w-12 rounded-full object-cover"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h3 className="text-lg font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    "{testimonial.text}"
                  </p>
                  <motion.div
                    className="mt-4 flex text-yellow-400"
                    initial={{ opacity: 0 }}
                    animate={
                      testimonialsInView ? { opacity: 1 } : { opacity: 0 }
                    }
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {[...Array(5)].map((_, starIndex) => (
                      <motion.svg
                        key={starIndex}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          testimonialsInView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{ delay: 0.7 + i * 0.1 + starIndex * 0.1 }}
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </motion.svg>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 overflow-hidden flex justify-center"
          ref={ctaRef}
          style={{
            background:
              "linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #0d9488 100%)",
            backgroundSize: "200% 200%",
          }}
          animate={isMobile ? {} : gradientAnimation}
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Ready to Find Your Doctor?
                </motion.h2>
                <motion.p
                  className="max-w-[900px] text-teal-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Download the DocFinder app today and get matched with the
                  perfect specialist in minutes.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-full sm:w-auto"
                >
                  <motion.span
                    className="absolute -inset-1 rounded-lg bg-white/20 blur-lg"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 relative z-10 w-full">
                    Download for iOS
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-full sm:w-auto"
                >
                  <motion.span
                    className="absolute -inset-1 rounded-lg bg-white/20 blur-lg"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 1,
                    }}
                  />
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 relative z-10 w-full">
                    Download for Android
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        className="w-full border-t bg-background py-6 md:py-12 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                >
                  <Stethoscope className="h-6 w-6 text-teal-600" />
                </motion.div>
                <span className="text-lg font-bold">DocFinder</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Finding the right doctor has never been easier.
              </p>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    About
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Careers
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Press
                  </a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Help Center
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Privacy Policy
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Terms of Service
                  </a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2 text-sm">
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Twitter
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Instagram
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#0d9488" }}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-teal-600 dark:text-gray-400"
                  >
                    Facebook
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            className="mt-10 border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            © {new Date().getFullYear()} DocFinder. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
