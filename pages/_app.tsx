import React from 'react'

import Meta from 'common/Meta'
import Firebase from 'common/Firebase'

import Layout from 'components/Layout/Layout'

import 'tailwindcss/tailwind.css'
import 'tippy.js/dist/tippy.css'

declare global {
  interface Window {
    firebase: any
  }
}

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Layout>
        <Meta />
        <Component {...pageProps} />
      </Layout>

      <Firebase />
    </>
  )
}

export default App
