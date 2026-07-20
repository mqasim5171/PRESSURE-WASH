import { Helmet } from 'react-helmet-async'

const CANON = 'https://arcturusservices.com.au'
export default function Meta({ title, desc, path, children }) {
  const url = path?.startsWith('http') ? path : `${CANON}${path || '/'}`
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {desc && <meta name="description" content={desc} />}
      {path && <link rel="canonical" href={url} />}
      <meta name="robots" content="index,follow" />
      {children /* optional JSON-LD */}
    </Helmet>
  )
}