// Mock data for development - will be replaced with backend integration

export const mockServices = [
  {
    id: 1,
    slug: "solar-panel-cleaning",
    title: "Solar Panel Cleaning",
    description: "Professional solar panel cleaning to maximize efficiency",
    price: "From $150",
    duration: "1-2 hours",
    includes: ["Soft brush cleaning", "Deionized water rinse", "Performance check", "Before/after photos"]
  },
  {
    id: 2,
    slug: "roof-gutter-cleaning", 
    title: "Roof & Gutter Cleaning",
    description: "Complete roof and gutter maintenance service",
    price: "From $200",
    duration: "2-3 hours", 
    includes: ["Debris removal", "Downpipe clearing", "Safety inspection", "Gutter guard check"]
  },
  {
    id: 3,
    slug: "window-cleaning",
    title: "Window Cleaning", 
    description: "Interior and exterior window cleaning service",
    price: "From $120",
    duration: "1-2 hours",
    includes: ["Interior cleaning", "Exterior cleaning", "Sill wiping", "Streak-free finish"]
  },
  {
    id: 4,
    slug: "pressure-washing",
    title: "Pressure Washing",
    description: "Professional pressure washing for all surfaces", 
    price: "From $180",
    duration: "2-4 hours",
    includes: ["Surface assessment", "Pressure washing", "Eco detergents", "Post-clean inspection"]
  }
];

export const mockBookings = [
  {
    id: 1,
    customerName: "John Smith",
    service: "Solar Panel Cleaning", 
    date: "2024-07-25",
    time: "10:00 AM",
    status: "confirmed",
    location: "Bondi, NSW"
  },
  {
    id: 2,
    customerName: "Sarah Johnson", 
    service: "Window Cleaning",
    date: "2024-07-26", 
    time: "2:00 PM",
    status: "pending",
    location: "Manly, NSW"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Bondi",
    rating: 5,
    text: "Incredible service! My solar panels are spotless and energy output increased by 28%.",
    service: "Solar Panel Cleaning",
    date: "2024-07-15"
  },
  {
    id: 2, 
    name: "Michael T.",
    location: "Chatswood",
    rating: 5,
    text: "Professional pressure washing that transformed our driveway completely.",
    service: "Pressure Washing", 
    date: "2024-07-10"
  }
];

export const mockQuotes = [
  {
    id: 1,
    name: "Lisa Parker",
    email: "lisa@email.com", 
    phone: "0412 345 678",
    service: "Roof & Gutter Cleaning",
    suburb: "Coogee",
    message: "Need urgent gutter cleaning before storm season",
    status: "new",
    createdAt: "2024-07-20T10:30:00Z"
  }
];