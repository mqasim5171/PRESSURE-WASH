import React from "react";
import Section from "../ui/Section";
import Glow from "../Glow";
import PackageCard from "./PackageCard";
import { packages as staticPackages, bundles as staticBundles } from "../../lib/packages";
import { useCms } from "../../lib/useCms";
import { mapPackage, mapBundle } from "../../lib/cmsAdapters";

/**
 * PackagesSection
 * ------------------
 * Dedicated "Choose the Right Clean for Your Property" section. Packages
 * and bundles are admin-editable (Admin > Packages) - this fetches the
 * live data and falls back to lib/packages.js if the API isn't reachable.
 */
export default function PackagesSection() {
  const { data: apiPackages } = useCms("/api/packages", null);
  const { data: apiBundles } = useCms("/api/bundles", null);
  const packages = apiPackages ? apiPackages.map(mapPackage) : staticPackages;
  const bundles = apiBundles ? apiBundles.map(mapBundle) : staticBundles;

  return (
    <Section id="packages" className="relative overflow-hidden bg-[#050910] py-24 border-t border-white/5">
      <Glow color="#22d3ee" className="w-[500px] h-[500px] -top-40 -right-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <header className="max-w-2xl mb-12">
          <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Packages</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
            Choose the Right Clean for Your Property
          </h2>
          <p className="text-white/60 mt-4 text-lg">
            From solar health checks to complete exterior care, bundle services and get more from a single visit.
          </p>
        </header>

        {/* Individual packages - solar first, matching its flagship priority */}
        <div className="grid md:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} highlight={pkg.badge === "Flagship Service"} />
          ))}
        </div>

        {/* Bundles */}
        <div className="mt-16">
          <div className="max-w-2xl mb-8">
            <span className="text-white/40 tracking-widest text-xs font-semibold uppercase">Service Bundles</span>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">
              Combine services, get more for your money.
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {bundles.map((bundle) => (
              <PackageCard
                key={bundle.id}
                name={bundle.name}
                tagline={null}
                badge={bundle.badge}
                features={bundle.includes}
                originalPrice={bundle.originalPrice}
                offerPrice={bundle.offerPrice}
                offerEndDate={bundle.offerEndDate}
                cta={bundle.cta}
                highlight={bundle.badge === "Best Value" || bundle.badge === "Most Popular"}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
