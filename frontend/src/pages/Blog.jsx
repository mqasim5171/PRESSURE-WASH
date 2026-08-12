import React, { useState } from "react";
import { X } from "lucide-react";
import Glow from '../components/Glow';
import Meta from '../Meta';

// Mock blog posts with full content
const blogPosts = [
  {
    id: 1,
    title: "How Often Should You Clean Your Solar Panels?",
    excerpt:
      "Learn the best practices and recommended frequency to keep your solar panels efficient.",
    content: `
      Keeping solar panels clean is essential for maximum energy output.
      In Sydney, experts recommend cleaning them every 6–12 months, depending on dust, bird droppings, or pollution levels.
      Professional cleaning ensures safety and efficiency compared to DIY.
    `,
    image: "/media/1.jpg",
  },
  {
    id: 2,
    title: "Pressure Washing: A Complete Guide",
    excerpt:
      "Discover how pressure washing can transform your space and why it's essential for maintenance.",
    content: `
      Pressure washing removes stubborn dirt, mold, and grime from outdoor surfaces.
      It's especially useful for driveways, decks, and exterior walls.
      Always use professional services to avoid damage from high pressure.
    `,
    image: "/media/2.jpg",
  },
  {
    id: 3,
    title: "Why Window Cleaning Boosts Curb Appeal",
    excerpt:
      "Shiny, streak-free windows don’t just look good — they add value to your home.",
    content: `
      Clean windows let in more natural light, improve views, and make your home look well-maintained.
      Regular professional cleaning prevents hard water stains and extends window lifespan.
    `,
    image: "/media/3.webp",
  },
  {
    id: 4,
    title: "How Drone Technology Powers Our Solar Cleaning",
    excerpt:
      "Our drone fleet is already flying — see how it reaches panels and roofs a ladder crew can't.",
    content: `
      Drone technology now powers our solar panel cleaning and high-rise exterior work.
      It means safer, faster, and more thorough cleaning on roofs and hard-to-reach areas,
      with a thermal scan first to show exactly where output is being lost to soiling.
    `,
    image: "/media/4.webp",
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <>
      <Meta title="Cleaning Tips & Updates | Arcturus Sydney" desc="Guides and updates on pressure washing, solar panel, roof & gutter, and window cleaning in Sydney." path="/blog" />
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
              Stay Updated with Arcturus Cleaning
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
                At <span className="font-semibold text-[#f79029]">Arcturus Cleaning</span>,
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
              <div
                key={post.id}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.06] transition cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">{post.title}</h3>
                  <p className="text-white/50 text-sm">{post.excerpt}</p>
                </div>
              </div>
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
              <span className="text-[#f79029] font-semibold">Arcturus Cleaning Services</span>
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

        {/* ===== Modal for Blog Post ===== */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-56 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-white">{selectedPost.title}</h2>
              <p className="text-white/60 whitespace-pre-line">
                {selectedPost.content}
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Blog;
