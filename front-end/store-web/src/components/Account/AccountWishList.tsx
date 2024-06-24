import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import ProductList from '../Common/ProductList/components/ProductList'

const AccountWishList = () => {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">Sản phẩm yêu thích</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
        <ProductList />
      </div>
      <div className="flex !mt-20 justify-center items-center">
        <ButtonSecondary loading>Xem thêm</ButtonSecondary>
      </div>
    </div>
  )
}

export default AccountWishList
