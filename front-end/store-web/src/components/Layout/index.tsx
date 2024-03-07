import Header from './Header'
import Footer from './Footer'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
