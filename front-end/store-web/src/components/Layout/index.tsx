import Header from './Header'
import Footer from './Footer'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="text-gray-700 leading-normal text-base tracking-normal">
      <Header />
      <main className="bg-gray-100">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
