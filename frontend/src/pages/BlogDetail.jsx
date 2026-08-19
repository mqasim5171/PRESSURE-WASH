// src/pages/BlogDetail.jsx
//
// Dynamic blog post page - /blog/:slug. Database-driven (Admin > Blog ->
// blog_posts -> GET /api/blog/:slug), same requirement as
// ServiceDetail/PackageDetail: a post published in admin needs a working
// URL immediately, no code change or redeploy. Replaces the old "posts open
// in a same-page modal" pattern in Blog.jsx with a real, shareable,
// bookmarkable, indexable route.
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Meta from "../Meta";
import { useCms } from "../lib/useCms";
import { resolveMediaUrl } from "../lib/media";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, loading } = useCms(`/api/blog/${slug}`, null);

  const title = post ? (post.seoTitle || `${post.title} | Horizon Solar & Exterior Care`) : "Blog | Horizon Solar & Exterior Care";
  const desc = post ? (post.metaDescription || post.excerpt) : "Guides and updates from Horizon Solar & Exterior Care.";
  const image = post?.featuredImageUrl ? resolveMediaUrl(post.featuredImageUrl) : (post?.ogImageUrl ? resolveMediaUrl(post.ogImageUrl) : undefined);

  if (!post && loading) {
    return (
      <main className="pt-24 bg-[#02060c] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#22d3ee] rounded-full animate-spin" />
      </main>
    );
  }

  if (!post) {
    return (
      <>
        <Meta title={title} desc={desc} path="/blog" />
        <main className="pt-24 bg-[#02060c] min-h-screen">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Post Not Found</h1>
            <p className="text-white/60 mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <>
      <Meta title={title} desc={desc} path={`/blog/${post.slug}`} image={image} />
      <main className="pt-24 bg-[#02060c] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#22d3ee] hover:text-white font-medium transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {post.category?.name && (
            <span className="text-[#22d3ee] tracking-widest text-sm font-semibold uppercase">{post.category.name}</span>
          )}
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold text-white leading-tight">{post.title}</h1>

          <div className="mt-4 flex items-center gap-5 text-white/50 text-sm">
            {post.author && (
              <span className="inline-flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
            )}
            {publishedDate && (
              <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {publishedDate}</span>
            )}
          </div>

          {image && (
            <img src={image} alt={post.title} className="w-full h-72 md:h-96 object-cover rounded-2xl border border-white/10 mt-8" />
          )}

          {/* Real HTML - either the admin's rich-text editor output or the
              migrated legacy posts' <p>-wrapped plain text (see
              backend/src/scripts/seedContent.js). Never raw user input. */}
          <div
            className="mt-10 text-white/70 text-lg leading-relaxed [&_p]:mb-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-5 [&_a]:text-[#22d3ee] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#22d3ee]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-white/50 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 bg-white/[0.04] border border-white/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
            <p className="text-white/60 mb-6">Get a fast, no-obligation quote — same-day slots often available.</p>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-[#22d3ee] text-black font-semibold px-7 py-3.5 hover:bg-white transition-colors">
              Get Free Quote
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
