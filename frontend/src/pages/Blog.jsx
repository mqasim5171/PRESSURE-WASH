import React, { useState } from "react";

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
    title: "The Future of Cleaning: Drone Technology",
    excerpt:
      "Drone cleaning is on the horizon — see how it will revolutionize large-scale cleaning services.",
    content: `
      Drone technology is set to revolutionize cleaning by making high-rise and hard-to-reach areas accessible. 
      This means safer, faster, and more eco-friendly cleaning solutions.
    `,
    image: "/media/4.webp",
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="bg-white text-gray-900">
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
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Stay Updated with{" "}
            <span style={{ color: "#F79029" }}>Arcturus Cleaning</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Window Cleaning • Pressure Washing • Solar Cleaning <br />
            🚁 Drone Cleaning Launching Soon!
          </p>

          {/* Newsletter Form */}
          <form className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full sm:w-72 rounded-lg text-black focus:outline-none"
              required
            />
            <button
              type="submit"
              style={{ backgroundColor: "#F79029" }}
              className="px-6 py-3 text-black font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      {/* ===== Soft & Pressure Washing Section ===== */}
<section className="py-16 px-6 bg-slate-50">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    {/* Text Content */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Soft Washing vs. Pressure Washing
      </h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        At <span className="font-semibold text-[#F79029]">Arcturus Cleaning</span>, 
        we specialize in both <span className="font-medium">soft washing</span> and 
        <span className="font-medium"> pressure washing</span> to deliver the 
        perfect clean for your home or business.
        <br /><br />
         <span className="font-semibold">Soft Washing</span> uses low pressure 
        combined with eco-friendly solutions, making it ideal for delicate 
        surfaces like roofs, siding, and painted areas without causing damage.
        <br /><br />
         <span className="font-semibold">Pressure Washing</span> relies on 
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
        className="rounded-xl shadow-lg w-full max-h-[420px] object-cover"
      />
    </div>
  </div>
</section>


      {/* ===== Blog Listing Section ===== */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Latest Blog Posts
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ===== Real Work Videos Section ===== */}
<section className="py-16 px-6 bg-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      See Us in Action 🚀
    </h2>
    <p className="text-lg text-gray-700 mb-10">
      Nothing speaks louder than results. Watch how{" "}
      <span className="text-[#F79029] font-semibold">Arcturus Cleaning Services</span> 
      transforms windows, solar panels, and outdoor surfaces with professional 
      soft washing, pressure washing, and more.
    </p>

    {/* Video Grid */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Video 1 */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
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
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        <video 
          controls 
          className="w-full h-full object-cover"
          poster="/media/window.JPG"
        >
          <source src="/media/window.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video 3 */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg md:col-span-2">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
            >
              ✕
            </button>

            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-3">{selectedPost.title}</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedPost.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;