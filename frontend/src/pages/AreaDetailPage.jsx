import React from "react";
import { useParams, Link } from "react-router-dom";
import { copy } from "../lib/copy";
import { MapPin, Clock, CheckCircle, Star } from "lucide-react";

const AreaDetailPage = () => {
  const { slug } = useParams();
  const area = copy.areas.featured.find((a) => a.slug === slug);

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

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-[#1D2B6F] text-white py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Professional Cleaning Services{" "}
              <span className="text-[#F79029]">{area.name}</span>
            </h1>
            {area.tagline && <p className="text-lg mb-6">{area.tagline}</p>}

            <div className="space-y-2 mb-6">
              <p className="flex items-center gap-2">
                <MapPin className="text-[#F79029]" size={18} />
                Servicing {area.name} {area.postcode && <>• Postcode {area.postcode}</>}
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

            <div className="grid grid-cols-2 gap-2 mt-8 text-sm">
              {[
                "Local specialists",
                "Same-day service",
                "Fully insured & licensed",
                "Free detailed quotes",
                "Eco-friendly solutions",
                "5-star customer service",
              ].map((point) => (
                <p key={point} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" /> {point}
                </p>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            {area.lat && area.lng ? (
              <iframe
                title={`${area.name} map`}
                src={`https://www.google.com/maps?q=${area.lat},${area.lng}&z=14&output=embed`}
                className="w-full h-80 md:h-96 rounded-xl shadow-lg"
                allowFullScreen
                loading="lazy"
              ></iframe>
            ) : (
              <div className="bg-gray-200 w-full h-80 md:h-96 flex items-center justify-center rounded-xl shadow-lg">
                <p className="text-gray-600">Map not available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Why Choose Our {area.name} Cleaning Services?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {area.description || `We provide trusted cleaning services across ${area.name}.`}
        </p>
      </section>

      {/* Popular Services */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Popular Cleaning Services in {area.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {copy.services?.length ? (
              copy.services.slice(0, 6).map((service) => (
                <div
                  key={service.slug}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* Dynamic Icon from lucide-react */}
                  {React.createElement(require("lucide-react")[service.icon] || require("lucide-react").Sparkles, {
                    size: 32,
                    className: "text-[#F79029] mb-4",
                  })}
                  <h3 className="font-semibold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.blurb}</p>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-600">
                No services available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          What Our Customers Say in {area.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {copy.testimonials.items.map((t, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg"
            >
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} />
                ))}
              </div>
              <p className="text-gray-700 italic">“{t.text}”</p>
              <p className="mt-4 font-semibold">{t.name} – {t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#F79029] text-white py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book a Cleaning in {area.name}?
          </h2>
          <p className="mb-6">
            Contact us today for a free, no-obligation quote and let us take
            care of the rest.
          </p>
          <Link
            to="/contact"
            className="bg-white text-[#1D2B6F] px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AreaDetailPage;
