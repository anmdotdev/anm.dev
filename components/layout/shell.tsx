import Footer from './footer'
import Header from './header'

const Shell = ({ children }) => (
  <div className="relative min-h-screen w-full bg-gray-lightest pb-52 max-sm:pb-76 dark:bg-dark-bg">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
)

export default Shell
