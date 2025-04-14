"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Filter,
  MapPin,
  Search,
  Star,
  Stethoscope,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { getDistanceInKm } from "./lib/utils";

// Types
interface Symptom {
  id: string;
  name: string;
  category: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  availability: string;
  image: string;
  specialties: string[];
}

// Sample data
const symptoms: Symptom[] = [
  { id: "s1", name: "Headache", category: "Neurological" },
  { id: "s2", name: "Fever", category: "General" },
  { id: "s3", name: "Cough", category: "Respiratory" },
  { id: "s4", name: "Fatigue", category: "General" },
  { id: "s5", name: "Nausea", category: "Digestive" },
  { id: "s6", name: "Joint Pain", category: "Musculoskeletal" },
  { id: "s7", name: "Dizziness", category: "Neurological" },
  { id: "s8", name: "Shortness of Breath", category: "Respiratory" },
  { id: "s9", name: "Chest Pain", category: "Cardiovascular" },
  { id: "s10", name: "Abdominal Pain", category: "Digestive" },
  { id: "s11", name: "Rash", category: "Dermatological" },
  { id: "s12", name: "Sore Throat", category: "ENT" },
  { id: "s13", name: "Back Pain", category: "Musculoskeletal" },
  { id: "s14", name: "Anxiety", category: "Mental Health" },
  { id: "s15", name: "Depression", category: "Mental Health" },
  { id: "s16", name: "Insomnia", category: "Sleep" },
  { id: "s17", name: "Blurred Vision", category: "Ophthalmological" },
  { id: "s18", name: "Ear Pain", category: "ENT" },
  { id: "s19", name: "Numbness", category: "Neurological" },
  { id: "s20", name: "Swelling", category: "General" },
];

const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 124,
    location: "Mercy Hospital",
    distance: "2.3 miles",
    availability: "Today",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Headache", "Dizziness", "Numbness"],
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Pulmonologist",
    rating: 4.7,
    reviews: 98,
    location: "City Medical Center",
    distance: "3.1 miles",
    availability: "Tomorrow",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Cough", "Shortness of Breath"],
  },
  {
    id: "d3",
    name: "Dr. Emily Rodriguez",
    specialty: "Gastroenterologist",
    rating: 4.8,
    reviews: 156,
    location: "University Hospital",
    distance: "1.8 miles",
    availability: "Today",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Nausea", "Abdominal Pain"],
  },
  {
    id: "d4",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 210,
    location: "Heart Care Center",
    distance: "4.2 miles",
    availability: "In 2 days",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Chest Pain", "Shortness of Breath"],
  },
  {
    id: "d5",
    name: "Dr. Olivia Thompson",
    specialty: "Dermatologist",
    rating: 4.6,
    reviews: 87,
    location: "Skin Health Clinic",
    distance: "2.7 miles",
    availability: "Today",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Rash", "Swelling"],
  },
  {
    id: "d6",
    name: "Dr. David Kim",
    specialty: "Psychiatrist",
    rating: 4.8,
    reviews: 132,
    location: "Mind Wellness Center",
    distance: "3.5 miles",
    availability: "Tomorrow",
    image: "/placeholder.svg?height=200&width=200",
    specialties: ["Anxiety", "Depression", "Insomnia"],
  },
];

export default function FindDoctorPage() {
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [fetchedDoctors, setFetchedDoctors] = useState<any>();
  const [filteredSymptoms, setFilteredSymptoms] = useState<Symptom[]>(symptoms);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  ); // { lat: ..., lng: ... }
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError("Unable to retrieve your location: " + err.message);
      }
    );
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter symptoms based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = symptoms.filter(
        (symptom) =>
          symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedSymptoms.some((selected) => selected.id === symptom.id)
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms(
        symptoms.filter(
          (symptom) =>
            !selectedSymptoms.some((selected) => selected.id === symptom.id)
        )
      );
    }
  }, [searchTerm, selectedSymptoms]);

  // Filter doctors based on selected symptoms
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        const symptomNames = selectedSymptoms.map((s) => s.name);
        const filtered = doctors.filter((doctor) =>
          doctor.specialties.some((specialty) =>
            symptomNames.includes(specialty)
          )
        );

        // Sort doctors based on the selected sort option
        let sorted = [...filtered];
        if (sortBy === "rating") {
          sorted = sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "distance") {
          sorted = sorted.sort(
            (a, b) =>
              Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
          );
        } else if (sortBy === "availability") {
          const availabilityRank = (availability: string) => {
            if (availability === "Today") return 0;
            if (availability === "Tomorrow") return 1;
            return 2;
          };
          sorted = sorted.sort(
            (a, b) =>
              availabilityRank(a.availability) -
              availabilityRank(b.availability)
          );
        }

        setFilteredDoctors(sorted);
        setIsLoading(false);
      }, 800);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedSymptoms, sortBy]);

  const handleSymptomSelect = (symptom: Symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleRemoveSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptomId));
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
    setSearchTerm("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const doctorCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const mobileFiltersVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
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

  useEffect(() => {
    const handleFindDoctor = async () => {
      if (!location) return;

      const apiKey = "AIzaSyCRNCjEZpQqJUWV1NVj_V1-JDnqRl0qekU";
      const origin = { lat: location.lat, lng: location.lng };

      const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.lat},${origin.lng}&radius=5000&type=doctor&keyword=cardiologist&key=${apiKey}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        console.log(data);

        if (!data.results) {
          console.warn("No results found");
          return;
        }

        const simplified = data.results.map((place: any) => {
          const {
            name,
            opening_hours,
            rating,
            user_ratings_total,
            vicinity,
            place_id,
            geometry,
            types,
            photos,
          } = place;

          const location = geometry.location;
          const distance = getDistanceInKm(
            origin.lat,
            origin.lng,
            location.lat,
            location.lng
          );

          const imageUrl = photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${apiKey}`
            : null;

          return {
            name,
            open_now: opening_hours?.open_now ?? "unknown",
            rating,
            user_ratings_total,
            location,
            vicinity,
            place_id,
            types,
            distance_km: distance,
            imageUrl,
          };
        });

        setFetchedDoctors(simplified); // ✅ Now we set an array of doctors
        console.log("Doctors fetched:", simplified);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    handleFindDoctor();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm flex justify-center">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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
            <span className="text-lg font-bold">DocFinder</span>
          </a>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              How It Works
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              For Doctors
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 max-w-7xl">
        {/* Page Title */}
        <motion.div
          className="mb-8 text-center mx-auto max-w-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find the Right Doctor
          </h1>
          <p className="mt-2 text-gray-600">
            Select your symptoms to match with specialists who can help
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="mx-auto mb-8 max-w-3xl rounded-xl bg-white p-6 shadow-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <Search className="mr-2 h-5 w-5 text-gray-400" />
              <div className="flex flex-1 flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <Badge
                    key={symptom.id}
                    className="bg-teal-100 text-teal-800 hover:bg-teal-200"
                  >
                    {symptom.name}
                    <button
                      className="ml-1 rounded-full p-0.5 hover:bg-teal-200"
                      onClick={() => handleRemoveSymptom(symptom.id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  placeholder={
                    selectedSymptoms.length > 0
                      ? ""
                      : "Search symptoms or conditions..."
                  }
                  className="flex-1 border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                />
              </div>
              {selectedSymptoms.length > 0 && (
                <button
                  className="ml-2 text-sm text-gray-500 hover:text-teal-600"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && filteredSymptoms.length > 0 && (
                <motion.div
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  {filteredSymptoms.map((symptom) => (
                    <motion.div
                      key={symptom.id}
                      className="flex cursor-pointer items-center px-4 py-2 hover:bg-teal-50"
                      onClick={() => handleSymptomSelect(symptom)}
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium">{symptom.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({symptom.category})
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleSymptomSelect(symptoms[0])}
              >
                Headache
              </Badge>
              <Badge
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleSymptomSelect(symptoms[2])}
              >
                Cough
              </Badge>
              <Badge
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleSymptomSelect(symptoms[3])}
              >
                Fatigue
              </Badge>
              <Badge
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => handleSymptomSelect(symptoms[9])}
              >
                Abdominal Pain
              </Badge>
            </div>

            <Button
              className="bg-teal-600 hover:bg-teal-700"
              disabled={selectedSymptoms.length === 0}
            >
              Find Doctors
            </Button>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mx-auto">
          {/* Filters - Desktop */}
          <motion.div
            className="hidden md:block rounded-xl bg-white p-6 shadow-md h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button className="text-sm text-teal-600 hover:text-teal-800">
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Sort By */}
              <div>
                <h4 className="mb-2 font-medium">Sort By</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="relevance"
                      name="sortBy"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      checked={sortBy === "relevance"}
                      onChange={() => setSortBy("relevance")}
                    />
                    <label
                      htmlFor="relevance"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Relevance
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating"
                      name="sortBy"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      checked={sortBy === "rating"}
                      onChange={() => setSortBy("rating")}
                    />
                    <label
                      htmlFor="rating"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Highest Rated
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="distance"
                      name="sortBy"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      checked={sortBy === "distance"}
                      onChange={() => setSortBy("distance")}
                    />
                    <label
                      htmlFor="distance"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Nearest
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="availability"
                      name="sortBy"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                      checked={sortBy === "availability"}
                      onChange={() => setSortBy("availability")}
                    />
                    <label
                      htmlFor="availability"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Earliest Available
                    </label>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="mb-2 font-medium">Availability</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="today"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="today"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Today
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tomorrow"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="tomorrow"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Tomorrow
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="this-week"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="this-week"
                      className="ml-2 text-sm text-gray-700"
                    >
                      This Week
                    </label>
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div>
                <h4 className="mb-2 font-medium">Distance</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="under-5"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="under-5"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Under 5 miles
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="5-10"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="5-10"
                      className="ml-2 text-sm text-gray-700"
                    >
                      5-10 miles
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="10-plus"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="10-plus"
                      className="ml-2 text-sm text-gray-700"
                    >
                      10+ miles
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Filters Button */}
          <div className="md:hidden fixed bottom-4 right-4 z-30">
            <motion.button
              className="flex items-center justify-center rounded-full bg-teal-600 p-4 text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={mobileFiltersVariants}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Filters</h3>
                    <button
                      className="rounded-full p-1 hover:bg-gray-100"
                      onClick={() => setIsFiltersOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Sort By */}
                    <div>
                      <h4 className="mb-2 font-medium">Sort By</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-relevance"
                            name="mobileSortBy"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                            checked={sortBy === "relevance"}
                            onChange={() => setSortBy("relevance")}
                          />
                          <label
                            htmlFor="mobile-relevance"
                            className="ml-2 text-gray-700"
                          >
                            Relevance
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-rating"
                            name="mobileSortBy"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                            checked={sortBy === "rating"}
                            onChange={() => setSortBy("rating")}
                          />
                          <label
                            htmlFor="mobile-rating"
                            className="ml-2 text-gray-700"
                          >
                            Highest Rated
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-distance"
                            name="mobileSortBy"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                            checked={sortBy === "distance"}
                            onChange={() => setSortBy("distance")}
                          />
                          <label
                            htmlFor="mobile-distance"
                            className="ml-2 text-gray-700"
                          >
                            Nearest
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="mobile-availability"
                            name="mobileSortBy"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                            checked={sortBy === "availability"}
                            onChange={() => setSortBy("availability")}
                          />
                          <label
                            htmlFor="mobile-availability"
                            className="ml-2 text-gray-700"
                          >
                            Earliest Available
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h4 className="mb-2 font-medium">Availability</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-today"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-today"
                            className="ml-2 text-gray-700"
                          >
                            Today
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-tomorrow"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-tomorrow"
                            className="ml-2 text-gray-700"
                          >
                            Tomorrow
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-this-week"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-this-week"
                            className="ml-2 text-gray-700"
                          >
                            This Week
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div>
                      <h4 className="mb-2 font-medium">Distance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-under-5"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-under-5"
                            className="ml-2 text-gray-700"
                          >
                            Under 5 miles
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-5-10"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-5-10"
                            className="ml-2 text-gray-700"
                          >
                            5-10 miles
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mobile-10-plus"
                            className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                          />
                          <label
                            htmlFor="mobile-10-plus"
                            className="ml-2 text-gray-700"
                          >
                            10+ miles
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsFiltersOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-teal-600 hover:bg-teal-700"
                      onClick={() => setIsFiltersOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Doctor Results */}
          <div className="md:col-span-3">
            {/* Results Header */}
            <motion.div
              className="mb-4 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold">
                {selectedSymptoms.length > 0
                  ? `Doctors for ${selectedSymptoms
                      .map((s) => s.name)
                      .join(", ")}`
                  : "All Doctors"}
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  {filteredDoctors.length} doctors found
                </span>
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading ? (
              <motion.div
                className="flex h-64 items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      className="overflow-hidden rounded-xl border bg-white shadow-md transition-all hover:shadow-lg"
                      custom={index}
                      variants={doctorCardVariants}
                      whileHover={{ y: -5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="flex items-center justify-center p-4 md:p-6">
                          <motion.img
                            src={doctor.image}
                            alt={doctor.name}
                            className="h-24 w-24 rounded-full object-cover"
                            whileHover={{ scale: 1.05 }}
                          />
                        </div>
                        <div className="col-span-2 p-4 md:p-6">
                          <div className="mb-2 flex items-center">
                            <h3 className="text-lg font-bold">{doctor.name}</h3>
                            {doctor.availability === "Today" && (
                              <Badge className="ml-2 bg-green-100 text-green-800">
                                Available Today
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          <div className="mt-2 flex items-center">
                            <div className="flex items-center text-yellow-400">
                              <Star className="mr-1 h-4 w-4 fill-current" />
                              <span className="font-medium">
                                {doctor.rating}
                              </span>
                            </div>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {doctor.reviews} reviews
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {doctor.specialties.map((specialty) => (
                              <Badge
                                key={specialty}
                                className="bg-teal-50 text-teal-700"
                                variant="outline"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col justify-between border-t p-4 md:border-l md:border-t-0 md:p-6">
                          <div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span className="text-sm">{doctor.location}</span>
                            </div>
                            <div className="mt-1 flex items-center text-gray-600">
                              <Clock className="mr-1 h-4 w-4" />
                              <span className="text-sm">
                                Available {doctor.availability}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-gray-600">
                              <span className="text-sm">
                                {doctor.distance} away
                              </span>
                            </div>
                          </div>
                          <motion.div
                            className="mt-4"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button className="w-full bg-teal-600 hover:bg-teal-700">
                              Book Appointment
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center rounded-xl border bg-white p-8 text-center"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="mb-4 rounded-full bg-teal-50 p-4"
                      animate={pulseAnimation}
                    >
                      <Search className="h-8 w-8 text-teal-600" />
                    </motion.div>
                    <h3 className="mb-2 text-xl font-semibold">
                      No doctors found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or selecting different
                      symptoms
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
