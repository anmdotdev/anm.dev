'use client'

import Header from './Header'
import Footer from './Footer'

import { css } from '@pigment-css/react'

const Layout = ({ children }) => (
  <main
    className={css(({ theme }) => ({
      backgroundColor: theme.colors.gray.lightest,
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      paddingBottom: 256,

      '@media (max-width: 540px)': {
        paddingBottom: 384,
      },
    }))}
  >
    <Header />
    {children}
    <Footer />
  </main>
)

export default Layout
