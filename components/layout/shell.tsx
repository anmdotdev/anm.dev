import Footer from './footer'
import Header from './header'

const Shell = ({ children }) => (
  <main className="w-full bg-gray-lightest min-h-screen relative pb-64 max-sm:pb-96">
    <Header />
    {children}
    <Footer />
  </main>
)

export default Shell
