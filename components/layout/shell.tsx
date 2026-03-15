import Footer from './footer'
import Header from './header'

const Shell = ({ children }) => (
  <main className="relative min-h-screen w-full bg-gray-lightest pb-52 max-sm:pb-76 dark:bg-dark-bg">
    <Header />
    {children}
    <Footer />
  </main>
)

export default Shell
