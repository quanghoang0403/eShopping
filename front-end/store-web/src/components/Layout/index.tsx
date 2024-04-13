import Header from './Header'
import Footer from './Footer'
import Notification from '../Notification'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="text-gray-800 leading-normal text-base tracking-normal overflow-x-hidden">
      <Header />
      <Notification />
      <main className="bg-gray-100">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
