import Footer from './footer'
import Header from './header'

const Shell = ({ children }) => (
  <div className="relative min-h-screen w-full bg-gray-lightest pb-64 max-sm:pb-88 dark:bg-dark-bg">
    <a
      className="absolute top-3 left-3 z-50 -translate-y-16 rounded-md bg-black px-3 py-2 text-sm text-white transition-transform focus:translate-y-0 dark:bg-dark-text dark:text-dark-bg"
      href="#main-content"
    >
      Skip to main content
    </a>
    <Header />
    <main id="main-content">{children}</main>
    <Footer />
  </div>
)

export default Shell
