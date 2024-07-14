import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import ProductList from '../Common/ProductList/components/ProductList'
import { useAppSelector } from '@/hooks/useRedux'
import { useEffect, useState } from 'react'
import ProductService from '@/services/product.service'

const AccountWishList = () => {
  const wishListCodes = useAppSelector(state => state.session.wishListCodes)
  const [product,setProduct] = useState<IProduct[]>([])
  const getProductWishList = async ()=>{
    const res = await ProductService.getProductWishList({productCodes: wishListCodes})
    if(res){
      setProduct(res)
    }
  }
  useEffect(()=>{
    getProductWishList()
  },[wishListCodes])
  return (
    <div className="space-y-10 sm:space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">Sản phẩm yêu thích</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
        <ProductList data={product}/>
      </div>
      <div className="flex !mt-20 justify-center items-center">
        <ButtonSecondary loading>Xem thêm</ButtonSecondary>
      </div>
    </div>
  )
}

export default AccountWishList
