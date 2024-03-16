import Header from './Header'
import Footer from './Footer'
interface ILayout {
  children: React.ReactNode
}

const MainLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="bg-white text-gray-600 work-sans leading-normal text-base tracking-normal">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
