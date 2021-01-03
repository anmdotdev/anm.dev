import React, { useEffect } from 'react'

import Header from './Header'
import Footer from './Footer'

import { analytics } from 'utils/analytics'

const Layout = ({ children }) => {
  useEffect(() => {
    analytics()
  }, [])

  return (
    <main className="w-full bg-gray-lightest min-h-screen relative pb-64 sm:pb-96">
      <Header />
      {children}
      <Footer />
    </main>
  )
}

export default Layout
