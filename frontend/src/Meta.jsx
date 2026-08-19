import { Helmet } from 'react-helmet-async'

const CANON = 'https://horizonsolar.com.au'
const DEFAULT_IMAGE = `${CANON}/images/drone-sequence/scene-1-front.webp`

export default function Meta({ title, desc, path, image, type = 'website', children }) {
  const url = path?.startsWith('http') ? path : `${CANON}${path || '/'}`
  const ogImage = image?.startsWith('http') ? image : image ? `${CANON}${image}` : DEFAULT_IMAGE

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {desc && <meta name="description" content={desc} />}
      {path && <link rel="canonical" href={url} />}
      <meta name="robots" content="index,follow" />

      {/* Open Graph - social previews (Facebook, LinkedIn, WhatsApp, Slack) */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Horizon Solar & Exterior Care" />
      {title && <meta property="og:title" content={title} />}
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter/X card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {desc && <meta name="twitter:description" content={desc} />}
      <meta name="twitter:image" content={ogImage} />

      {/* Local SEO signal - every page is scoped to Sydney, NSW */}
      <meta name="geo.region" content="AU-NSW" />
      <meta name="geo.placename" content="Sydney" />

      {children /* optional JSON-LD */}
    </Helmet>
  )
}
