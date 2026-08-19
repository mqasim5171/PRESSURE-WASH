// Migrates the site's CURRENT real content (from frontend/src/lib/copy.js,
// frontend/src/lib/packages.js, and the Stats / HotspotDetection /
// BeforeAfterSlider / WhyChooseUs components) into the CMS tables, so the
// public site is never left empty just because content now comes from a
// database instead of source files. Idempotent - every insert is guarded
// by a findOrCreate on a stable natural key (slug / sectionKey / pageKey),
// safe to run again after the schema changes.
require("dotenv").config();
const {
  sequelize, Service, Package, Bundle, Review, Faq, ServiceArea,
  HeroSlide, HomepageSection, PageContent, SiteSetting, ThemeSetting,
} = require("../models");

async function seedContent() {
  await sequelize.authenticate();

  // -- Site settings --------------------------------------------------------
  const [settings] = await SiteSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
  await settings.update({
    businessName: "Horizon Solar & Exterior Care",
    tagline: "Solar Panel Cleaning + Thermal Inspection",
    phone: "02 8000 1080",
    email: "info@arcturusservices.com.au", // TODO: replace once the new domain/email is confirmed
    address: "Sydney NSW",
    businessHours: "Mon–Sat 8–6",
    socials: {
      facebook: "https://www.facebook.com/profile.php?id=61571124837167&_rdc=1&_rdr",
      instagram: "https://www.instagram.com/arcturus_services/",
      tiktok: "https://www.tiktok.com/@arcturusservices",
      linkedin: "https://www.linkedin.com/company/arcturus-services",
    },
    mainCtaLabel: "Get a Free Quote",
    mainCtaUrl: "/contact",
    copyrightText: "Horizon Solar & Exterior Care. All rights reserved.",
  });

  // Theme defaults already match ThemeSetting model defaults (real colors
  // already in use across the site) - just ensure the row exists.
  await ThemeSetting.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });

  // -- Services ---------------------------------------------------------
  const servicesData = [
    {
      slug: "solar-cleaning-maintenance",
      name: "Solar Panel Cleaning + Thermal Health Scan",
      shortDescription: "Drone-powered solar panel cleaning combined with a radiometric thermal pass — lifts energy output and flags soiling or hotspots a visual check would miss.",
      icon: "Sun",
      features: ["Professional drone-powered panel cleaning", "DJI Matrice 4T thermal drone scan", "Hotspot & soiling detection", "Warranty-safe cleaning technique", "12+ Point Solar Health Check"],
      isPrimary: true, primaryOrder: 1, ctaLabel: "View Solar Package", ctaUrl: "/services/solar-cleaning-maintenance", displayOrder: 1,
    },
    {
      slug: "roof-gutter-cleaning",
      name: "Roof Cleaning",
      shortDescription: "Professional roof cleaning that removes moss, lichen and weather staining and protects your property from water damage — gutters cleared as part of the same visit.",
      icon: "Home",
      features: ["Moss, lichen & organic growth removal", "Weather staining treated", "Gutters cleared of debris", "Prevents water damage"],
      isPrimary: true, primaryOrder: 2, ctaLabel: "View Roof Package", ctaUrl: "/services/roof-gutter-cleaning", displayOrder: 2,
    },
    {
      slug: "concrete-cleaning",
      name: "Concrete Cleaning",
      shortDescription: "Restore driveways, paths, patios and other concrete surfaces to like-new condition, removing built-up dirt, staining and grime.",
      icon: "Droplets",
      features: ["Driveways, paths & patios", "Built-up dirt & staining removed", "All concrete surface types", "Eco-friendly process"],
      isPrimary: true, primaryOrder: 3, ctaLabel: "View Concrete Package", ctaUrl: "/services/concrete-cleaning", displayOrder: 3,
    },
    {
      slug: "window-cleaning",
      name: "Window Cleaning",
      shortDescription: "Crystal clear windows for homes and businesses across Sydney.",
      icon: "Square",
      features: ["Streak-free results", "Inside & outside", "Regular maintenance"],
      isPrimary: false, primaryOrder: null, ctaLabel: "Get a Free Quote", ctaUrl: "/contact", displayOrder: 4,
    },
  ];
  const serviceRecords = {};
  for (const s of servicesData) {
    const [record] = await Service.findOrCreate({ where: { slug: s.slug }, defaults: s });
    serviceRecords[s.slug] = record;
  }

  // -- Packages + service links ------------------------------------------
  const packagesData = [
    { slug: "solar-care", name: "Solar Care", tagline: "Bring Your Solar Back to Life", featured: true, displayOrder: 1,
      features: ["Professional drone-powered solar panel cleaning", "DJI Matrice 4T thermal drone scan", "12+ Point Solar Health Check", "Hotspot & soiling detection report"],
      ctaLabel: "View Solar Package", ctaUrl: "/services/solar-cleaning-maintenance", serviceSlug: "solar-cleaning-maintenance" },
    { slug: "roof-clean", name: "Roof Clean", tagline: "Moss, Lichen & Grime — Gone", featured: false, displayOrder: 2,
      features: ["Full roof surface clean", "Moss & lichen removal", "Weather staining treated", "Gutters cleared of debris"],
      ctaLabel: "View Roof Package", ctaUrl: "/services/roof-gutter-cleaning", serviceSlug: "roof-gutter-cleaning" },
    { slug: "concrete-clean", name: "Concrete Clean", tagline: "Driveways, Paths & Patios Refreshed", featured: false, displayOrder: 3,
      features: ["Driveways, paths & patios", "Built-up dirt & staining removed", "All concrete surface types", "Eco-friendly process"],
      ctaLabel: "View Concrete Package", ctaUrl: "/services/concrete-cleaning", serviceSlug: "concrete-cleaning" },
  ];
  for (const p of packagesData) {
    const { serviceSlug, ...data } = p;
    const [pkg] = await Package.findOrCreate({ where: { slug: p.slug }, defaults: data });
    const service = serviceRecords[serviceSlug];
    if (service) await pkg.addService(service).catch(() => {}); // ignore if already linked
  }

  // -- Bundles ------------------------------------------------------------
  const bundlesData = [
    { name: "Solar Care", badge: null, includes: ["Solar Panel Cleaning", "DJI Matrice 4T Thermal Scan", "12+ Point Solar Health Check"], displayOrder: 1 },
    { name: "Home Exterior", badge: null, includes: ["Roof Cleaning", "Concrete Cleaning"], displayOrder: 2 },
    { name: "Complete Property Care", badge: "Best Value", includes: ["Solar Panel Cleaning", "Thermal Scan", "Roof Cleaning", "Concrete Cleaning"], displayOrder: 3 },
  ];
  for (const b of bundlesData) {
    await Bundle.findOrCreate({ where: { name: b.name }, defaults: b });
  }

  // -- Reviews --------------------------------------------------------------
  const reviewsData = [
    { customerName: "Sarah M.", location: "Bondi", featured: true, displayOrder: 1,
      reviewText: "Had my solar panels cleaned by Horizon Solar & Exterior Care and couldn't be happier! They increased our energy output by 28% and were incredibly professional throughout. Highly recommend to anyone wanting to maximize their solar investment." },
    { customerName: "Michael T.", location: "Chatswood", featured: false, displayOrder: 2,
      reviewText: "Absolutely fantastic pressure washing service! My concrete driveway looked terrible after years of stains and weathering. Now it looks like we have a brand new driveway. Professional, punctual and worth every penny!" },
    { customerName: "Lisa K.", location: "Manly", featured: false, displayOrder: 3,
      reviewText: "Called Horizon for an urgent roof and gutter clean before the storm season. They came same-day, cleared everything perfectly and potentially saved us from serious water damage. Professional service at its absolute best!" },
  ];
  for (const r of reviewsData) {
    await Review.findOrCreate({ where: { customerName: r.customerName, reviewText: r.reviewText }, defaults: r });
  }

  // -- FAQs -----------------------------------------------------------------
  const faqsData = [
    { question: "Do you provide same-day service?", answer: "Yes! We offer same-day service across most Sydney suburbs, subject to availability. Contact us before 2 PM for potential same-day scheduling.", displayOrder: 1 },
    { question: "Are you fully insured?", answer: "Absolutely. We carry $10 million public liability insurance and full workers compensation coverage. All our technicians are licensed and insured.", displayOrder: 2 },
    { question: "What's included in your satisfaction guarantee?", answer: "If you're not completely satisfied with our work, we'll return at no extra charge to make it right. Your satisfaction is 100% guaranteed.", displayOrder: 3 },
    { question: "Do you clean solar panels safely?", answer: "Yes, we use specialized soft-brush techniques and deionized water to safely clean solar panels without voiding manufacturer warranties. All work maintains compliance.", displayOrder: 4 },
    { question: "How often should I have my gutters cleaned?", answer: "We recommend gutter cleaning every 6-12 months, or more frequently if you have overhanging trees. Regular maintenance prevents water damage and costly repairs.", displayOrder: 5 },
  ];
  for (const f of faqsData) {
    await Faq.findOrCreate({ where: { question: f.question }, defaults: f });
  }

  // -- Service areas ----------------------------------------------------
  // Full parity with the original frontend/src/lib/copy.js areas.featured
  // data (slug, tagline, per-suburb coverage notes, coordinates) - not a
  // reduced version, so the public Areas/AreaDetail pages lose nothing by
  // switching from static data to the CMS.
  const areasData = [
    { slug: "eastern-suburbs", city: "Eastern Suburbs", region: "Eastern Suburbs",
      tagline: "Complete cleaning solutions for the Eastern Suburbs.",
      description: "Our Eastern Suburbs team delivers top-tier residential and commercial cleaning across suburbs like Bondi, Randwick, Maroubra and more.",
      lat: -33.8928, lng: 151.2643, displayOrder: 1,
      coverageDetails: [
        { name: "Bondi", note: "Premium beachside cleaning services" },
        { name: "Coogee", note: "Coastal property specialists" },
        { name: "Maroubra", note: "Residential and commercial cleaning" },
        { name: "Double Bay", note: "Luxury property maintenance" },
        { name: "Rose Bay", note: "Harbourside cleaning experts" },
        { name: "Vaucluse", note: "High-end residential services" },
        { name: "Woollahra", note: "Heritage property care" },
        { name: "Paddington", note: "Terrace house specialists" },
      ] },
    { slug: "northern-beaches", city: "Northern Beaches", region: "Northern Beaches",
      tagline: "Trusted cleaning services for the Northern Beaches.",
      description: "From Manly to Palm Beach, our expert cleaners ensure your coastal home stays fresh and sparkling.",
      lat: -33.7980, lng: 151.2874, displayOrder: 2,
      coverageDetails: [
        { name: "Manly", note: "Beachfront property experts" },
        { name: "Dee Why", note: "Northern beaches specialists" },
        { name: "Avalon", note: "Premium coastal cleaning" },
        { name: "Palm Beach", note: "Exclusive beachside service" },
        { name: "Mona Vale", note: "Comprehensive cleaning solutions" },
        { name: "Freshwater", note: "Local beach community service" },
        { name: "Curl Curl", note: "Residential cleaning experts" },
        { name: "Narrabeen", note: "Family home specialists" },
      ] },
    { slug: "north-shore", city: "North Shore", region: "North Shore",
      tagline: "Premium cleaning services across the North Shore.",
      description: "Serving Chatswood, Mosman, Lane Cove and beyond with professional residential and commercial cleans.",
      lat: -33.7970, lng: 151.1837, displayOrder: 3,
      coverageDetails: [
        { name: "Chatswood", note: "Commercial and residential hub" },
        { name: "Lane Cove", note: "Leafy suburb specialists" },
        { name: "North Sydney", note: "Business district cleaning" },
        { name: "Mosman", note: "Premium harbour views" },
        { name: "Neutral Bay", note: "Harbourside apartments" },
        { name: "Cremorne", note: "Waterfront property care" },
        { name: "Willoughby", note: "Family suburb cleaning" },
        { name: "Artarmon", note: "Residential and office cleaning" },
      ] },
    { slug: "inner-west", city: "Inner West", region: "Inner West",
      tagline: "Reliable cleaning solutions for the Inner West.",
      description: "From Newtown to Marrickville and Leichhardt, our team brings thorough, dependable cleaning to your doorstep.",
      lat: -33.9005, lng: 151.1643, displayOrder: 4,
      coverageDetails: [
        { name: "Newtown", note: "Creative quarter cleaning" },
        { name: "Leichhardt", note: "Italian heritage area" },
        { name: "Balmain", note: "Historic harbour suburb" },
        { name: "Rozelle", note: "Trendy inner west hub" },
        { name: "Glebe", note: "Student and family area" },
        { name: "Surry Hills", note: "Urban apartment specialists" },
        { name: "Redfern", note: "Cultural district cleaning" },
        { name: "Marrickville", note: "Multicultural community service" },
      ] },
    { slug: "south-sydney", city: "South Sydney", region: "Southern Sydney",
      tagline: "Expert cleaning services for South Sydney.",
      description: "Covering Coogee, Maroubra, Mascot and more with deep cleans and maintenance services.",
      lat: -33.9230, lng: 151.2628, displayOrder: 5,
      coverageDetails: [
        { name: "Cronulla", note: "Beach suburb specialists" },
        { name: "Sutherland", note: "Shire area headquarters" },
        { name: "Hurstville", note: "Commercial district cleaning" },
        { name: "Kogarah", note: "St George area service" },
        { name: "Rockdale", note: "Industrial and residential" },
        { name: "Miranda", note: "Shopping hub specialists" },
        { name: "Caringbah", note: "Family suburb cleaning" },
        { name: "Engadine", note: "Growing residential area" },
      ] },
    { slug: "western-sydney", city: "Western Sydney", region: "Western Sydney",
      tagline: "Comprehensive cleaning across Western Sydney.",
      description: "Serving Penrith, Blacktown, and surrounding areas with reliable residential and commercial cleaning.",
      lat: -33.7513, lng: 150.6900, displayOrder: 6,
      coverageDetails: [
        { name: "Parramatta", note: "Major business district" },
        { name: "Blacktown", note: "Growing suburban area" },
        { name: "Liverpool", note: "Diverse community hub" },
        { name: "Penrith", note: "Western gateway cleaning" },
        { name: "Mount Druitt", note: "Family suburb specialists" },
        { name: "Fairfield", note: "Multicultural area service" },
        { name: "Bankstown", note: "Commercial and residential" },
        { name: "Auburn", note: "Community-focused cleaning" },
      ] },
    { slug: "hills-district", city: "Hills District", region: "Hills District",
      tagline: "Professional cleaning solutions in the Hills District.",
      description: "From Castle Hill to Kellyville, our experienced team ensures pristine results every time.",
      lat: -33.7550, lng: 150.9880, displayOrder: 7,
      coverageDetails: [
        { name: "Castle Hill", note: "Family-friendly cleaning" },
        { name: "Hornsby", note: "Bushland suburb care" },
        { name: "Ryde", note: "Riverside property service" },
        { name: "Epping", note: "Growing family area" },
        { name: "Carlingford", note: "Premium residential cleaning" },
        { name: "West Pennant Hills", note: "Leafy hills suburb" },
        { name: "Thornleigh", note: "Natural bush setting" },
        { name: "Wahroonga", note: "Upper north shore luxury" },
      ] },
  ];
  for (const a of areasData) {
    const [record] = await ServiceArea.findOrCreate({ where: { slug: a.slug }, defaults: a });
    // Backfill coverageDetails/tagline/lat/lng onto a row that was created
    // by an earlier version of this seed script (before those columns
    // existed) and is still empty, without touching anything an admin may
    // have since edited by hand.
    if (!record.coverageDetails?.length && a.coverageDetails?.length) {
      await record.update({ tagline: a.tagline, coverageDetails: a.coverageDetails, lat: a.lat, lng: a.lng });
    }
  }

  // -- Hero slides ----------------------------------------------------------
  const heroData = [
    { slideType: "standard", displayOrder: 1,
      eyebrow: "Sydney · Solar Cleaning & Thermal Inspection",
      heading: "Professional Solar Cleaning.", subheading: "Thermal-Verified Results.",
      description: "We combine expert solar, roof and exterior cleaning with advanced drone thermal inspection — so you know your property isn't just clean, it's actually performing.",
      ctaLabel: "View Our Services", ctaUrl: "/services" },
    { slideType: "before_after", displayOrder: 2,
      eyebrow: "Solar Panel Transformation",
      heading: "Restore Your Solar.", subheading: "Protect Your Investment.",
      description: "Professional solar panel cleaning combined with advanced system inspection.",
      ctaLabel: "View Solar Packages", ctaUrl: "/#packages" },
    { slideType: "thermal", displayOrder: 3,
      eyebrow: "Thermal Solar Inspection",
      heading: "See Problems", subheading: "Your Eyes Can't.",
      description: "Abnormal heat patterns and hotspots can point to underperforming areas that a visual check alone would miss.",
      ctaLabel: "Book a Thermal Scan", ctaUrl: "/contact",
      thermalInfo: {
        title: "See Problems Your Eyes Can't.",
        bullets: [
          "Uneven heat or dirt buildup",
          "Partial shading",
          "Damaged or ageing cells",
          "Possible system underperformance",
        ],
      } },
  ];
  for (const h of heroData) {
    // Matched on slideType alone (not slideType+heading) - there's exactly
    // one canonical slide per type, and matching on heading too meant
    // editing a slide's heading in the admin (changing the natural key)
    // made a later re-seed create a second, duplicate row instead of
    // recognising the existing one.
    await HeroSlide.findOrCreate({ where: { slideType: h.slideType }, defaults: h });
  }

  // -- Homepage sections ------------------------------------------------
  const sections = [
    { sectionKey: "why_us_value", displayOrder: 1, content: {
      eyebrow: "Why Horizon", heading: "More value. One visit.",
      description: "Professional cleaning, advanced inspection and smarter service bundles.",
      points: [
        { number: "01", title: "Clean + Inspect in One Visit", text: "Professional solar cleaning and advanced thermal inspection happen in the same visit, instead of arranging multiple separate services." },
        { number: "02", title: "More Than a Surface Clean", text: "Our flagship solar package includes a 12+ Point Solar Health Check, adding real inspection value on top of the clean." },
        { number: "03", title: "Advanced Thermal Technology", text: "We fly the DJI Matrice 4T to provide professional thermal inspection capability alongside every solar clean." },
        { number: "04", title: "Save With Service Bundles", text: "Combine solar, roof and concrete cleaning into a single package designed to deliver stronger overall value than booking separately." },
      ],
    } },
    { sectionKey: "three_faults", displayOrder: 2, content: {
      eyebrow: "Fault Detection", heading: "Three faults on one roof.",
      description: "Select a marker to see what the thermal pass found — and why a plain visual check would have missed it.",
      faults: [
        { label: "Cell hotspot", severity: "Critical", detail: "Module C4 running 21°C above array median — resistive junction, high fire-risk indicator." },
        { label: "Bypass diode failure", severity: "High", detail: "Localised droppings are shading three cells in this string." },
        { label: "Soiling band", severity: "Moderate", detail: "A light residue layer, early-stage soiling that's easy to miss visually." },
      ],
    } },
    { sectionKey: "why_us_stats", displayOrder: 3, content: {
      eyebrow: "Why Horizon",
      stats: [
        { value: "2400+", label: "Arrays inspected across Sydney" },
        { value: "98%", label: "Faults found on first flight" },
        { value: "48h", label: "From scan to detailed report" },
        { value: "21°C", label: "Typical hotspot delta detected" },
      ],
    } },
    { sectionKey: "same_roof_story", displayOrder: 4, content: {
      eyebrow: "Visual vs Thermal", heading: "The same roof. A different story.",
      description: "Drag the handle. On the left, panels that look perfectly clean. On the right, the heat signature that reveals what a visual check alone would miss.",
    } },
  ];
  for (const s of sections) {
    await HomepageSection.findOrCreate({ where: { sectionKey: s.sectionKey }, defaults: s });
  }

  // -- Page content -----------------------------------------------------
  const pages = [
    { pageKey: "about", heading: "About Horizon Solar & Exterior Care", intro: "Sydney's Most Trusted Professional Cleaning Service",
      seoTitle: "About Horizon Solar & Exterior Care | Free Quote Sydney",
      seoDescription: "Drone-powered solar panel cleaning, thermal scanning and pressure washing across Sydney, NSW.",
      body: {
        body: "We're a Melbourne registered, Sydney operating professional cleaning service committed to delivering exceptional results that protect and enhance your property value.\n\nWith over 1000 satisfied customers this year alone, we've built our reputation on reliability, professionalism, and results that exceed expectations. Our team uses only the best equipment and techniques to ensure every job meets our high standards.\n\nWhether it's solar panel cleaning to boost your energy efficiency, roof and gutter maintenance to prevent water damage, crystal-clear window cleaning, or pressure washing to restore your outdoor surfaces - we deliver professional results with a 100% satisfaction guarantee.\n\nLicensed, insured, and available 7 days a week with same-day service options.",
        features: ["Melbourne Registered Business", "$10M Public Liability Insurance", "Licensed & Certified Technicians", "Same-Day Service Available", "100% Satisfaction Guarantee", "5-Star Google Rated Service"],
      } },
    { pageKey: "services-landing", heading: "Our Services",
      intro: "Drone-powered solar panel cleaning and pressure washing are what we do best, backed up by roof, gutter and window cleaning — with same-day availability.",
      seoTitle: "Cleaning Services in Sydney | Horizon Solar & Exterior Care",
      seoDescription: "Drone-powered solar panel cleaning and pressure washing, plus roof & gutter and window cleaning. Fast quotes. Same-day service.",
      body: {} },
    { pageKey: "homepage", heading: "Professional Solar Cleaning. Thermal-Verified Results.",
      intro: "We combine expert solar, roof and exterior cleaning with advanced drone thermal inspection.",
      seoTitle: "Solar Panel Cleaning & Thermal Inspection Sydney | Horizon Solar & Exterior Care",
      seoDescription: "Professional solar panel cleaning combined with DJI Matrice 4T thermal drone inspection, plus roof and concrete cleaning across Sydney. Same-day service.",
      body: {} },
  ];
  for (const p of pages) {
    await PageContent.findOrCreate({ where: { pageKey: p.pageKey }, defaults: p });
  }

  console.log("[seed] Existing site content migrated into the database.");
}

if (require.main === module) {
  seedContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[seed] Failed to seed content:", err);
      process.exit(1);
    });
}

module.exports = { seedContent };
