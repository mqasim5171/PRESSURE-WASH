export const copy = {
  nav: [
    { href: "/#services", label: "Services" },
    { href: "/areas",     label: "Areas" },
    { href: "/gallery",   label: "Gallery" },
    { href: "/about",     label: "About" },
    { href: "/contact",   label: "Contact" },
    { href: "/blog",      label: "Blog" }
  ],
  topbar: [
    "Limited Time: Same-Day Service Available",
    "5-Star Rated Service • Fully Insured",
    "📞 Call Now: 0414 203 262",
  ],
  hero: {
    eyebrow: "Melbourne Registered • Sydney Operating",
    headline: "Sydney's #1 Professional",
    headlineStrong: "Cleaning Services",
    sub: "Solar Panels • Roofs & Gutters • Windows • Pressure Washing",
    badges: ["Same-Day Service Available","Fully Insured & Licensed","100% Satisfaction Guarantee"],
    metrics: [
      { label: "Fully Insured", value: "$10M Coverage" },
      { label: "5-Star Rated", value: "200+ Reviews" },
      { label: "Happy Customers", value: "1000+ This Year" },
      { label: "ABN Licensed", value: "Verified Business" },
    ],
    ctaPrimary:  { label: "Get Free Quote Now", href: "/contact" },
    ctaSecondary:{ label: "Call 0414 203 262", href: "tel:0414203262" },
    image: { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", alt: "Professional cleaning service in action" },
    logo:  { src: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", alt: "Arcturus Services Logo" },
  },
  servicesIntro: {
    title: "Professional Cleaning Services Sydney",
    sub: "Expert cleaning solutions that protect and enhance your property's value with guaranteed results and same-day availability",
  },
  services: [
    {
      slug: "solar-panel-cleaning",
      title: "Solar Panel Cleaning",
      blurb: "Increase energy efficiency by up to 30% with professional solar panel cleaning using specialized equipment",
      long: "Our certified technicians safely remove dust, bird droppings, and environmental residues to restore optimal solar output while maintaining manufacturer warranty compliance. Using deionized water and soft-brush techniques.",
      bullets: ["Up to 30% efficiency boost","Warranty compliance guaranteed","Professional equipment & insurance","Before/after performance reports"],
      icon: "Sun",
    },
    {
      slug: "roof-gutter-cleaning",
      title: "Roof & Gutter Cleaning", 
      blurb: "Protect your property from water damage with comprehensive roof and gutter cleaning services",
      long: "Complete debris removal, downpipe clearing, and controlled rinse system to keep water flowing freely and prevent costly structural damage. Safety-first approach with full insurance coverage.",
      bullets: ["Prevent expensive water damage","Complete debris removal","Safety equipment used","Downpipe clearing included"],
      icon: "Home",
    },
    {
      slug: "window-cleaning",
      title: "Window Cleaning",
      blurb: "Crystal clear windows for homes and businesses across Sydney with interior and exterior service",
      long: "Streak-free professional finish using purified water systems and premium squeegee techniques. Interior and exterior service available with scheduled maintenance programs for ongoing clarity.",
      bullets: ["Streak-free guaranteed results","Interior & exterior service","Scheduled maintenance available","Commercial & residential"],
      icon: "Square",
    },
    {
      slug: "pressure-washing",
      title: "Pressure Washing",
      blurb: "Restore driveways, patios, and external surfaces to like-new condition with professional pressure cleaning",
      long: "Calibrated PSI settings and eco-friendly detergents for concrete, pavers, brick, composite decking and more. No zebra striping or surface damage - just professional results that last.",
      bullets: ["Remove stubborn stains & mold","All surface types covered","Eco-friendly cleaning agents","No surface damage guarantee"],
      icon: "Droplets",
    },
    {
  slug: "drone-based-washing",
  title: "Drone-Based Cleaning",
  blurb: "Efficient and safe high-rise and hard-to-reach cleaning using advanced drone technology",
  long: "Our state-of-the-art drones reach rooftops, solar panels, and building facades that are difficult or dangerous to access manually. Equipped with high-pressure water and eco-friendly cleaning solutions, they deliver precise cleaning while minimizing risks and disruption.",
  bullets: [
    "Access hard-to-reach areas safely",
    "High precision cleaning with drones",
    "Eco-friendly water and solutions",
    "Reduces manual labor & safety risks"
  ],
  icon: "Drone", // You can pick an icon representing drones or flight
}
  ],
  process: {
    title: "Why Choose Arcturus Services?",
    subtitle: "Professional, reliable, and committed to exceeding expectations every time",
    cards: [
      { title: "Melbourne Registered", text: "Licensed, insured and trusted professionals operating across Sydney", icon: "Shield" },
      { title: "Same-Day Service", text: "Fast response when you need it most - available 7 days a week", icon: "Clock" },
      { title: "100% Guarantee", text: "Complete satisfaction guaranteed or we'll return to make it right", icon: "CheckCircle" },
      { title: "247+ Happy Customers", text: "5-star rated service across all Sydney suburbs and growing daily", icon: "Star" },
    ],
  },
  testimonials: {
    title: "What Sydney Customers Say",
    rating: "5.0 Stars",
    sub: "Based on 247+ verified Google reviews",
    items: [
      { 
        name:"Sarah M.", 
        location:"Bondi",
        text:"Had my solar panels cleaned by Arcturus Services and couldn't be happier! They increased our energy output by 28% and were incredibly professional throughout. Highly recommend to anyone wanting to maximize their solar investment." 
      },
      { 
        name:"Michael T.", 
        location:"Chatswood",
        text:"Absolutely fantastic pressure washing service! My concrete driveway looked terrible after years of stains and weathering. Now it looks like we have a brand new driveway. Professional, punctual and worth every penny!" 
      },
      { 
        name:"Lisa K.", 
        location:"Manly",
        text:"Called Arcturus for an urgent roof and gutter clean before the storm season. They came same-day, cleared everything perfectly and potentially saved us from serious water damage. Professional service at its absolute best!" 
      },
    ],
  },
  areas: {
    title: "Serving All Sydney Suburbs",
    sub: "Professional cleaning services across Eastern Suburbs, Northern Beaches, North Shore, Inner West, South Sydney & Western Sydney",
    featured: [
      { name:"Bondi & Eastern Suburbs", blurb:"Premium coastal cleaning services for beachside properties" },
      { name:"Manly & Northern Beaches", blurb:"Specialized service for coastal salt and sand cleaning" },
      { name:"Chatswood & North Shore", blurb:"Professional cleaning for prestigious North Shore homes" },
      { name:"Parramatta & Western Sydney", blurb:"Comprehensive cleaning across Western Sydney suburbs" },
      { name:"Coogee & South Sydney", blurb:"Expert cleaning services for South Sydney properties" },
      { name:"Mosman & Lower North Shore", blurb:"Premium residential cleaning in harbourside suburbs" },
    ],
    cta: { label:"View All Service Areas", href:"/areas" },
  },
  gallery: {
    title: "Before & After Results",
    subtitle: "See the dramatic difference our professional cleaning makes",
    images: [
      { src:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Driveway pressure washing before and after", caption: "Driveway Pressure Washing" },
      { src:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"House exterior cleaning result", caption: "House Exterior Cleaning" },
      { src:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Roof cleaning professional result", caption: "Roof & Gutter Cleaning" },
      { src:"https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Window cleaning crystal clear result", caption: "Window Cleaning" },
      { src:"https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Patio pressure cleaning transformation", caption: "Patio Cleaning" },
      { src:"https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Commercial facade cleaning", caption: "Commercial Cleaning" },
      { src:"https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Solar panel cleaning efficiency", caption: "Solar Panel Cleaning" },
      { src:"https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Gutter clearing and cleaning", caption: "Gutter Maintenance" },
      { src:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", alt:"Pavers restored to original condition", caption: "Paver Restoration" },
    ],
  },
  faq: { 
    title:"Frequently Asked Questions", 
    items: [
      {
        q: "Do you provide same-day service?",
        a: "Yes! We offer same-day service across most Sydney suburbs, subject to availability. Contact us before 2 PM for potential same-day scheduling."
      },
      {
        q: "Are you fully insured?",
        a: "Absolutely. We carry $10 million public liability insurance and full workers compensation coverage. All our technicians are licensed and insured."
      },
      {
        q: "What's included in your satisfaction guarantee?",
        a: "If you're not completely satisfied with our work, we'll return at no extra charge to make it right. Your satisfaction is 100% guaranteed."
      },
      {
        q: "Do you clean solar panels safely?",
        a: "Yes, we use specialized soft-brush techniques and deionized water to safely clean solar panels without voiding manufacturer warranties. All work maintains compliance."
      },
      {
        q: "How often should I have my gutters cleaned?",
        a: "We recommend gutter cleaning every 6-12 months, or more frequently if you have overhanging trees. Regular maintenance prevents water damage and costly repairs."
      }
    ] 
  },
  cta: {
    line: "Ready for Professional Results?",
    subline: "Free Quotes • Same Day Service Available • 100% Satisfaction Guaranteed",
    button: { label:"Get Free Quote Now", href:"/contact" },
    phone:  { label:"Call 0414 203 262", href:"tel:0414203262" },
  },
  about: {
    title: "About Arcturus Services",
    subtitle: "Sydney's Most Trusted Professional Cleaning Service",
    body: `We're a Melbourne registered, Sydney operating professional cleaning service committed to delivering exceptional results that protect and enhance your property value.

With over 1000 satisfied customers this year alone, we've built our reputation on reliability, professionalism, and results that exceed expectations. Our team uses only the best equipment and techniques to ensure every job meets our high standards.

Whether it's solar panel cleaning to boost your energy efficiency, roof and gutter maintenance to prevent water damage, crystal-clear window cleaning, or pressure washing to restore your outdoor surfaces - we deliver professional results with a 100% satisfaction guarantee.

Licensed, insured, and available 7 days a week with same-day service options.`,
    image: { src:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt:"Professional cleaning team at work" },
    features: [
      "Melbourne Registered Business",
      "$10M Public Liability Insurance", 
      "Licensed & Certified Technicians",
      "Same-Day Service Available",
      "100% Satisfaction Guarantee",
      "5-Star Google Rated Service"
    ]
  },
  contact: {
    title: "Get Your Free Quote",
    sub: "Tell us about your cleaning needs and we'll provide a detailed quote within 24 hours. Same-day service available across Sydney.",
    consent: "I agree to be contacted about my cleaning service enquiry via phone, email or SMS.",
    success: "Thanks! We've received your request and will contact you within 2 hours during business hours.",
    error: "Something went wrong. Please try calling us directly on 0414 203 262 or try again.",
    businessHours: "Monday to Saturday: 8:00 AM - 6:00 PM",
    emergencyNote: "For urgent same-day requests, please call directly: 0414 203 262"
  },
};