import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => (
  <main className="w-full bg-gray-lightest min-h-screen relative pb-64 sm:pb-96">
    <Header />
    {children}
    <Footer />
  </main>
)

export default Layout
