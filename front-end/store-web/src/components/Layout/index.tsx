import Header from './Header'
import Footer from './Footer'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="bg-white text-gray-600 leading-normal text-base tracking-normal">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
