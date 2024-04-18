import Header from './Header'
import Footer from './Footer'
import Notification from '../Notification'
import { usePromiseTracker } from 'react-promise-tracker'
import Loading from '../Loading'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  const { promiseInProgress } = usePromiseTracker()
  return (
    <div className="text-gray-800 leading-normal text-base tracking-normal overflow-x-hidden">
      <Header />
      <Notification />
      {promiseInProgress && <Loading />}
      <main className="bg-gray-100">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
