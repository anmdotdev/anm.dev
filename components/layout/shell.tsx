import Footer from './footer'
import Header from './header'

const Shell = ({ children }) => (
  <main className="relative min-h-screen w-full bg-gray-lightest pb-64 max-sm:pb-96">
    <Header />
    {children}
    <Footer />
  </main>
)

export default Shell
