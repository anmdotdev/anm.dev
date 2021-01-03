import { Fragment } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'

import defaultMeta from '../utils/meta.json'

type Props = {}

const { domain, prefetchPaths, ...seo } = defaultMeta

const Meta: React.FC<Props> = () => {
  const { route, asPath } = useRouter()
  const canonical = `${domain}${(asPath || '').split('?')[0]}`

  return (
    <>
      <Head>
        <meta httpEquiv="Content-type" content="text/html; charset=utf-8" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {(prefetchPaths ?? []).map((path) => (
          <Fragment key={`prefetch_${path}`}>
            <link rel="preconnect" href={path} />
            <link rel="dns-prefetch" href={path} />
          </Fragment>
        ))}

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="manifest" href="/manifest.json" />

        <meta charSet="utf-8" />
        <meta name="author" content="Anmol Mahatpurkar" />
        <meta name="copyright" content="Anmol Mahatpurkar" />

        <link rel="apple-touch-icon" sizes="180x180" href="/logos/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logos/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logos/favicon-16x16.png" />

        <link rel="mask-icon" href="/logos/safari-pinned-tab.svg" color="#222222" />
        <meta name="msapplication-TileColor" content="#222222" />
        <meta name="theme-color" content="#ffffff" />

        <link
          href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <DefaultSeo {...seo} canonical={route !== '/_error' ? canonical : null} />
    </>
  )
}

export default Meta
