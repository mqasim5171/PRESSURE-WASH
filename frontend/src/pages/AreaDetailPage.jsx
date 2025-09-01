// src/pages/AreaDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { copy } from "../lib/copy";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const AreaDetailPage = () => {
  const { slug } = useParams();
  const area = copy.areas.featured.find((a) => a.slug === slug);
  const [openIndex, setOpenIndex] = useState(null);

  if (!area) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Area Not Found</h1>
        <Link to="/areas" className="text-[#F79029] underline mt-4 block">
          Back to All Areas
        </Link>
      </div>
    );
  }

  const services = (copy.services || []).filter(
    (s) => s.slug !== "drone-based-washing"
  );

  const defaultWhy = [
    "Local specialists",
    "Same-day service",
    "Fully insured & licensed",
    "Eco-friendly solutions",
    "5-star customer service",
  ];
  const whyPoints =
    area.whyChoose && Array.isArray(area.whyChoose)
      ? area.whyChoose
      : defaultWhy;

    const faqs =
    area.faqs && Array.isArray(area.faqs)
      ? area.faqs
      : [
          {
            question: `How quickly can you provide cleaning in ${area.name}?`,
            answer: "We often offer same-day or next-day service in this area.",
          },
          {
            question: "Are your services insured?",
            answer:
              "Yes, all our cleaning services are fully insured and performed by licensed professionals.",
          },
          {
            question: "Do you bring your own equipment?",
            answer:
              "Yes, our cleaners come fully equipped with eco-friendly supplies.",
          },
          {
            question: `How much does cleaning cost in ${area.name}?`,
            answer:
              "Pricing depends on the type of cleaning and property size. Contact us for a free, no-obligation quote.",
          },
          {
            question: "What payment methods do you accept?",
            answer:
              "We accept cash, credit/debit cards, and secure online payments.",
          },
          {
            question: "Do you provide same-day cleaning services?",
            answer:
              "Yes, subject to availability. We recommend booking as early as possible for same-day service.",
          },
          {
            question: `What makes your ${area.name} cleaning services different?`,
            answer:
              "We combine local expertise, eco-friendly cleaning solutions, flexible scheduling, and a customer-first approach.",
          },
          {
            question: "Can I schedule regular cleanings?",
            answer:
              "Yes, we offer weekly, bi-weekly, and monthly cleaning plans that can be customized to your needs.",
          },
          {
            question: "Do you offer commercial or office cleaning?",
            answer:
              "Absolutely. We provide cleaning for both residential and commercial spaces.",
          },
          {
            question: "Do I need to be home during the cleaning?",
            answer:
              "It’s up to you. Many of our clients provide access instructions, and we handle the rest.",
          },
        ];


  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-[#1D2B6F] text-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Professional Cleaning Services{" "}
              <span className="text-[#F79029]">{area.name}</span>
            </h1>
            {area.tagline && <p className="text-lg mb-6">{area.tagline}</p>}

            <div className="space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <MapPin className="text-[#F79029]" size={18} />
                Servicing {area.name}{" "}
                {area.postcode && <>• Postcode {area.postcode}</>}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="text-[#F79029]" size={18} />
                Quick Response • Same-Day Service Available
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="bg-[#F79029] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-md"
              >
                Get Free Quote for {area.name}
              </Link>
              <a
                href="tel:0414203262"
                className="bg-white text-[#1D2B6F] px-6 py-3 rounded-lg font-semibold shadow-md border hover:bg-gray-100"
              >
                Call 0414 203 262
              </a>
            </div>
          </div>

          <div>
            {area.lat && area.lng ? (
              <iframe
                title={`${area.name} map`}
                src={`https://www.google.com/maps?q=${area.lat},${area.lng}&z=14&output=embed`}
                className="w-full h-80 md:h-96 rounded-xl shadow-lg"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className="bg-gray-200 w-full h-80 md:h-96 flex items-center justify-center rounded-xl shadow-lg">
                <p className="text-gray-600">Map not available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            Popular Cleaning Services in {area.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {services.length ? (
              services.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col w-full h-[400px]"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-44 object-cover rounded-t-xl"
                    />
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-3 text-center">
                      {service.title}
                    </h3>

                    <p className="text-sm text-gray-600 text-center flex-1">
                      {service.blurb}
                    </p>

                    <Link
                      to="/contact"
                      className="mt-6 self-center bg-[#44B149] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-green-600 transition shadow"
                    >
                      Get a Free Quote
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-600">
                No services available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Why Choose Us for {area.name} Cleaning Services?
        </h2>

        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          {area.description ||
            `We provide trusted cleaning services across ${area.name}.`}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 text-sm max-w-4xl mx-auto">
          {whyPoints.map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle
                size={18}
                className="text-green-400 flex-shrink-0 mt-1"
              />
              <p className="text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Frequently Asked Questions - {area.name}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left text-lg font-medium text-gray-800"
                onClick={() => toggleFAQ(i)}
              >
                {faq.question}
                <span className="ml-2 text-xl">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Book Section */}
      <section className="py-16 px-6">
        <div className="bg-[#F79029] text-white rounded-2xl shadow-lg p-10 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to book your {area.name} cleaning service?
          </h2>
          <p className="mb-6 text-lg">
            Schedule your cleaning today and let our experts handle the rest.
          </p>
          <a
            href="/contact"
            className="bg-white text-[#F79029] font-semibold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Book Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default AreaDetailPage;
