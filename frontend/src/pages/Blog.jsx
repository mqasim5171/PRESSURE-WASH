import React from "react";
import { Link } from "react-router-dom";
import Glow from '../components/Glow';
import Meta from '../Meta';
import { useCms } from '../lib/useCms';
import { resolveMediaUrl } from '../lib/media';

// Static fallback - used only until Admin > Blog has real published posts
// (or if the API is briefly unreachable). These same 4 posts have also
// been migrated into the real blog_posts table (see
// backend/src/scripts/seedContent.js's seedBlogIfEmpty) using the exact
// same title -> slug rule the backend uses, so even this fallback's links
// resolve to a real, working /blog/:slug page rather than a dead end.
const fallbackPosts = [
  {
    id: 1,
    slug: "how-often-should-you-clean-your-solar-panels",
    title: "How Often Should You Clean Your Solar Panels?",
    excerpt: "Learn the best practices and recommended frequency to keep your solar panels efficient.",
    image: "/media/1.jpg",
  },
  {
    id: 2,
    slug: "pressure-washing-a-complete-guide",
    title: "Pressure Washing: A Complete Guide",
    excerpt: "Discover how pressure washing can transform your space and why it's essential for maintenance.",
    image: "/media/2.jpg",
  },
  {
    id: 3,
    slug: "why-window-cleaning-boosts-curb-appeal",
    title: "Why Window Cleaning Boosts Curb Appeal",
    excerpt: "Shiny, streak-free windows don't just look good — they add value to your home.",
    image: "/media/3.webp",
  },
  {
    id: 4,
    slug: "how-drone-technology-powers-our-solar-cleaning",
    title: "How Drone Technology Powers Our Solar Cleaning",
    excerpt: "Our drone fleet is already flying — see how it reaches panels and roofs a ladder crew can't.",
    image: "/media/4.webp",
  },
];

const mapApiPost = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  image: p.featuredImageUrl ? resolveMediaUrl(p.featuredImageUrl) : "/media/1.jpg",
});

const Blog = () => {
  const { data: apiPosts } = useCms("/api/blog", null);
  const blogPosts = apiPosts?.items?.length
    ? apiPosts.items.map(mapApiPost)
    : fallbackPosts;

  return (
    <>
      <Meta title="Cleaning Tips & Updates | Horizon Sydney" desc="Guides and updates on pressure washing, solar panel, roof & gutter, and window cleaning in Sydney." path="/blog" />
      <main className="pt-24 bg-[#02060c]">
        {/* ===== Hero Section ===== */}
        <section className="relative h-[70vh] w-full flex items-center justify-center text-white">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/media/blog.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#02060c]/70" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">Blog</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Stay Updated with Horizon Cleaning
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/60">
              Window Cleaning • Pressure Washing • Solar Cleaning <br />
              🛸 Drone-Powered Since Day One
            </p>

            {/* Newsletter Form */}
            <form className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 w-full sm:w-72 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]"
                required />
              <button
                type="submit"
                className="px-6 py-3 bg-[#22d3ee] text-black font-semibold rounded-full hover:bg-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* ===== Soft & Pressure Washing Section ===== */}
        <section className="py-20 px-6 bg-[#050910] border-t border-white/5">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Soft Washing vs. Pressure Washing
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                At <span className="font-semibold text-[#f79029]">Horizon Cleaning</span>,
                we specialize in both <span className="font-medium text-white">soft washing</span> and
                <span className="font-medium text-white"> pressure washing</span> to deliver the
                perfect clean for your home or business.
                <br /><br />
                <span className="font-semibold text-white">Soft Washing</span> uses low pressure
                combined with eco-friendly solutions, making it ideal for delicate
                surfaces like roofs, siding, and painted areas without causing damage.
                <br /><br />
                <span className="font-semibold text-white">Pressure Washing</span> relies on
                high-powered water jets to remove stubborn dirt, grime, and stains from
                hard surfaces like driveways, decks, and concrete.
                <br /><br />
                Choosing the right method ensures your property stays clean, safe, and
                looking brand new.
              </p>
            </div>

            {/* Image Content */}
            <div className="flex justify-center">
              <img
                src="/media/pressure.jpg"
                alt="Soft vs Pressure Washing"
                className="rounded-2xl border border-white/10 w-full max-h-[420px] object-cover" />
            </div>
          </div>
        </section>

        {/* ===== Blog Listing Section ===== */}
        <section className="relative overflow-hidden py-20 px-6 max-w-6xl mx-auto">
          <Glow color="#22d3ee" className="w-[420px] h-[420px] -top-20 right-0" opacity={0.06} />
          <h2 className="relative text-3xl font-bold text-center mb-10 text-white">
            Latest Blog Posts
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.06] transition"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">{post.title}</h3>
                  <p className="text-white/50 text-sm">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== Real Work Videos Section ===== */}
        <section className="py-20 px-6 bg-[#050910] border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See Us in Action
            </h2>
            <p className="text-lg text-white/60 mb-10">
              Nothing speaks louder than results. Watch how{" "}
              <span className="text-[#f79029] font-semibold">Horizon Cleaning Services</span>
              {" "}transforms windows, solar panels, and outdoor surfaces with professional
              soft washing, pressure washing, and more.
            </p>

            {/* Video Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Video 1 */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/media/1.jpg"
                >
                  <source src="/media/blog.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video 2 */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/media/window.jpg"
                >
                  <source src="/media/window.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video 3 */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 md:col-span-2">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/media/5.jpg"
                >
                  <source src="/media/5.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Blog;
