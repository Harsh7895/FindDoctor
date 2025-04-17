import { useState, useRef, useEffect } from "react"
import { useParams , Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Star,
  Stethoscope,
  Video,
  X,
  Paperclip,
  ImageIcon,
  Smile,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"

// Types
interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  location: string
  hospital: string
  experience: number
  education: string[]
  languages: string[]
  bio: string
  image: string
  price: string
  availability: {
    date: string
    slots: string[]
  }[]
  services: string[]
  conditions: string[]
  insurances: string[]
}

interface Message {
  id: string
  sender: "user" | "doctor"
  text: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
}

// Sample data
const doctorData: Doctor = {
  id: "d1",
  name: "Dr. Sarah Johnson",
  specialty: "Neurologist",
  rating: 4.9,
  reviews: 124,
  location: "123 Medical Plaza, New York, NY",
  hospital: "Mercy Hospital",
  experience: 12,
  education: [
    "MD, Harvard Medical School",
    "Residency, Johns Hopkins Hospital",
    "Fellowship in Neurology, Mayo Clinic",
  ],
  languages: ["English", "Spanish"],
  bio: "Dr. Sarah Johnson is a board-certified neurologist with over 12 years of experience specializing in headache disorders, movement disorders, and general neurology. She takes a patient-centered approach to care, focusing on comprehensive treatment plans that address both symptoms and underlying causes.",
  image: "/placeholder.svg?height=400&width=400",
  price: "$200",
  availability: [
    {
      date: "2025-04-18",
      slots: ["09:00", "10:30", "13:00", "15:30"],
    },
    {
      date: "2025-04-19",
      slots: ["08:30", "11:00", "14:00"],
    },
    {
      date: "2025-04-20",
      slots: ["10:00", "12:30", "16:00"],
    },
    {
      date: "2025-04-21",
      slots: ["09:30", "11:30", "14:30"],
    },
    {
      date: "2025-04-22",
      slots: ["08:00", "10:00", "13:30", "16:30"],
    },
  ],
  services: [
    "Neurological Consultation",
    "Headache Treatment",
    "Movement Disorder Management",
    "Nerve Conduction Studies",
    "Electromyography (EMG)",
    "Botox for Migraines",
  ],
  conditions: [
    "Migraines",
    "Parkinson's Disease",
    "Multiple Sclerosis",
    "Epilepsy",
    "Stroke",
    "Neuropathy",
    "Alzheimer's Disease",
  ],
  insurances: ["Blue Cross", "Aetna", "Cigna", "UnitedHealthcare", "Medicare"],
}

// Sample messages
const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "doctor",
    text: "Hello! How can I help you today?",
    timestamp: new Date(Date.now() - 3600000 * 24),
    status: "read",
  },
  {
    id: "m2",
    sender: "user",
    text: "Hi Dr. Johnson, I've been experiencing frequent headaches for the past week.",
    timestamp: new Date(Date.now() - 3600000 * 23),
    status: "read",
  },
  {
    id: "m3",
    sender: "doctor",
    text: "I'm sorry to hear that. Can you describe the pain and its location? Also, have you noticed any triggers?",
    timestamp: new Date(Date.now() - 3600000 * 22),
    status: "read",
  },
]

export default function DoctorDetailPage() {
  const params = useParams()
  const isMobile = useMobile()
  const [doctor, setDoctor] = useState<Doctor>(doctorData)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>(doctor.availability[0].date)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [appointmentType, setAppointmentType] = useState<"in-person" | "video">("in-person")
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isChatOpen])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: `m${messages.length + 1}`,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
      status: "sent",
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate doctor typing
    setIsTyping(true)

    // Simulate doctor response after a delay
    setTimeout(() => {
      setIsTyping(false)

      const doctorMessage: Message = {
        id: `m${messages.length + 2}`,
        sender: "doctor",
        text: "Thank you for sharing that information. Based on your symptoms, I recommend scheduling an appointment so I can perform a proper examination.",
        timestamp: new Date(),
        status: "sent",
      }

      setMessages((prev) => [...prev, doctorMessage])
    }, 3000)
  }

  // Handle booking an appointment
  const handleBookAppointment = () => {
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsBookingModalOpen(false)
      setBookingStep(1)
      // Show success message or redirect
    }, 1500)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  }

  const chatVariants = {
    hidden: { opacity: 0, y: 20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      y: 20,
      height: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
            >
              <Stethoscope className="h-6 w-6 text-teal-600" />
            </motion.div>
            <span className="text-lg font-bold">DocFinder</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/find-doctor">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Find Doctors
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/find-doctor">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-teal-600">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to search results
            </Button>
          </Link>
        </div>

        {/* Doctor Profile */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Doctor Info */}
          <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={containerVariants}>
            {/* Doctor Header */}
            <motion.div
              className="mb-8 flex flex-col rounded-xl bg-white p-6 shadow-md md:flex-row md:items-center"
              variants={itemVariants}
            >
              <motion.div className="mb-4 flex justify-center md:mb-0 md:mr-6" whileHover={{ scale: 1.05 }}>
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-teal-100"
                />
              </motion.div>
              <div className="flex flex-1 flex-col">
                <div className="mb-2 flex flex-wrap items-center justify-between">
                  <h1 className="text-2xl font-bold md:text-3xl">{doctor.name}</h1>
                  <div className="flex items-center">
                    <motion.button
                      className={`mr-2 rounded-full p-2 ${
                        isFavorite ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                    </motion.button>
                    <motion.button
                      className="rounded-full bg-gray-100 p-2 text-gray-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-600">{doctor.specialty}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center text-yellow-400">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    <span className="font-medium">{doctor.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{doctor.reviews} reviews</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span className="text-sm">{doctor.hospital}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="text-sm">{doctor.experience} years experience</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.languages.map((language) => (
                    <Badge key={language} variant="outline" className="bg-gray-50">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tabs Section */}
            <motion.div className="mb-8 rounded-xl bg-white p-6 shadow-md" variants={itemVariants}>
              <Tabs defaultValue="about">
                <TabsList className="mb-6 grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Biography</h3>
                    <p className="text-gray-600">{doctor.bio}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Education</h3>
                    <ul className="space-y-2">
                      {doctor.education.map((edu, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-teal-500" />
                          <span className="text-gray-600">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Conditions Treated</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.conditions.map((condition) => (
                        <Badge key={condition} className="bg-teal-50 text-teal-700">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">Insurance Accepted</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.insurances.map((insurance) => (
                        <Badge key={insurance} variant="outline" className="bg-gray-50">
                          {insurance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="services">
                  <h3 className="mb-4 text-lg font-semibold">Services Offered</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {doctor.services.map((service, index) => (
                      <div key={index} className="flex items-center rounded-lg border p-4">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{service}</p>
                          <p className="text-sm text-gray-500">Starting from {doctor.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews">
                  <h3 className="mb-4 text-lg font-semibold">Patient Reviews</h3>
                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-3 h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Patient" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">2 weeks ago</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Dr. Johnson was extremely thorough and took the time to explain everything. She listened to all
                        my concerns and provided clear treatment options.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-3 h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Patient" />
                            <AvatarFallback>MS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Maria Smith</p>
                            <p className="text-xs text-gray-500">1 month ago</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        I've been seeing Dr. Johnson for my migraines for over a year. Her treatment plan has
                        significantly reduced my episodes. Highly recommend!
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      View all {doctor.reviews} reviews
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="location">
                  <h3 className="mb-4 text-lg font-semibold">Office Location</h3>
                  <div className="mb-4 rounded-lg border p-4">
                    <div className="mb-2 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-teal-600" />
                      <p className="font-medium">{doctor.location}</p>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">Office hours: Monday-Friday, 9:00 AM - 5:00 PM</p>
                    <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-200">
                      {/* Map placeholder */}
                      <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">Map view</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <Button variant="outline" className="flex-1">
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Office
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>

          {/* Right Column - Booking */}
          <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
            {/* Booking Card */}
            <motion.div className="rounded-xl bg-white p-6 shadow-md" variants={itemVariants}>
              <h2 className="mb-4 text-xl font-bold">Book an Appointment</h2>
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Consultation Fee</p>
                <p className="text-2xl font-bold text-teal-600">{doctor.price}</p>
                <p className="text-sm text-gray-500">per visit</p>
              </div>
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-gray-700">Next Available</p>
                <div className="flex items-center text-gray-800">
                  <Calendar className="mr-2 h-5 w-5 text-teal-600" />
                  <span>Today, {doctor.availability[0].slots[0]}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsBookingModalOpen(true)}>
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with Doctor
                </Button>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Video Consultation
                </Button>
              </div>
            </motion.div>

            {/* Working Hours Card */}
            <motion.div className="rounded-xl bg-white p-6 shadow-md" variants={itemVariants}>
              <h3 className="mb-4 text-lg font-semibold">Working Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-500">Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="fixed bottom-0 right-4 z-30 w-full max-w-md rounded-t-xl bg-white shadow-lg md:right-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={chatVariants}
            >
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-xs text-green-600">Online now</p>
                  </div>
                </div>
                <button className="rounded-full p-1 hover:bg-gray-100" onClick={() => setIsChatOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-96 overflow-y-auto p-4" ref={chatContainerRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "doctor" && (
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            message.sender === "user" ? "text-teal-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {message.sender === "user" && (
                            <span className="ml-1">
                              {message.status === "read" ? (
                                <Check className="inline h-3 w-3" />
                              ) : (
                                <Check className="inline h-3 w-3" />
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[75%] rounded-lg bg-gray-100 p-3 text-gray-800">
                        <div className="flex space-x-1">
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: 0,
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: 0.1,
                            }}
                          />
                          <motion.div
                            className="h-2 w-2 rounded-full bg-gray-400"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: 0.2,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="border-t p-4">
                <div className="flex items-center">
                  <div className="flex space-x-2">
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="ml-2 flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <button
                    className="ml-2 rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {isBookingModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Book an Appointment</h2>
                  <button
                    className="rounded-full p-1 hover:bg-gray-100"
                    onClick={() => {
                      setIsBookingModalOpen(false)
                      setBookingStep(1)
                    }}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="mb-6 flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-1 items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step <= bookingStep ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`h-1 flex-1 ${step < bookingStep ? "bg-teal-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Select Date & Time */}
                {bookingStep === 1 && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Select Date & Time</h3>
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      {doctor.availability.map((avail) => (
                        <button
                          key={avail.date}
                          className={`rounded-lg border p-2 text-center text-sm ${
                            selectedDate === avail.date
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-gray-300 hover:border-teal-300"
                          }`}
                          onClick={() => setSelectedDate(avail.date)}
                        >
                          {formatDate(avail.date)}
                        </button>
                      ))}
                    </div>
                    <h4 className="mb-2 text-sm font-medium">Available Slots</h4>
                    <div className="mb-6 grid grid-cols-3 gap-2">
                      {doctor.availability
                        .find((avail) => avail.date === selectedDate)
                        ?.slots.map((slot) => (
                          <button
                            key={slot}
                            className={`rounded-lg border p-2 text-center text-sm ${
                              selectedTime === slot
                                ? "border-teal-600 bg-teal-50 text-teal-700"
                                : "border-gray-300 hover:border-teal-300"
                            }`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                    </div>
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={handleBookAppointment}
                      disabled={!selectedTime}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 2: Appointment Type */}
                {bookingStep === 2 && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Select Appointment Type</h3>
                    <div className="mb-6 space-y-3">
                      <button
                        className={`flex w-full items-center rounded-lg border p-4 ${
                          appointmentType === "in-person" ? "border-teal-600 bg-teal-50" : "border-gray-300"
                        }`}
                        onClick={() => setAppointmentType("in-person")}
                      >
                        <div
                          className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${
                            appointmentType === "in-person" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">In-Person Visit</p>
                          <p className="text-sm text-gray-500">Visit the doctor at their office</p>
                        </div>
                        {appointmentType === "in-person" && <Check className="h-5 w-5 text-teal-600" />}
                      </button>
                      <button
                        className={`flex w-full items-center rounded-lg border p-4 ${
                          appointmentType === "video" ? "border-teal-600 bg-teal-50" : "border-gray-300"
                        }`}
                        onClick={() => setAppointmentType("video")}
                      >
                        <div
                          className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${
                            appointmentType === "video" ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Video Consultation</p>
                          <p className="text-sm text-gray-500">Consult with the doctor online</p>
                        </div>
                        {appointmentType === "video" && <Check className="h-5 w-5 text-teal-600" />}
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1" onClick={() => setBookingStep(1)}>
                        Back
                      </Button>
                      <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleBookAppointment}>
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {bookingStep === 3 && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Confirm Appointment</h3>
                    <div className="mb-6 rounded-lg border p-4">
                      <div className="mb-4 flex items-center">
                        <Avatar className="mr-3 h-12 w-12">
                          <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">
                            {appointmentType === "in-person" ? "In-Person Visit" : "Video Consultation"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fee:</span>
                          <span className="font-medium text-teal-600">{doctor.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-sm text-yellow-800">
                        By confirming this appointment, you agree to our cancellation policy. You can cancel up to 24
                        hours before your appointment without any charges.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1" onClick={() => setBookingStep(2)}>
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-teal-600 hover:bg-teal-700"
                        onClick={handleBookAppointment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
