import React, { FC, useState } from 'react'
import Pagination from '@/shared/Pagination'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import TabFilter, { Filter } from '@/shared/Filter/TabFilter'
import PromoBanner1 from '@/components/Common/Banner/PromoBanner1'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import ProductList from '@/components/Common/ProductList/components/ProductList'
import { EnumGenderProduct, EnumSortType } from '@/constants/enum'

// export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {
//   const { params, req } = context
//   try {
//     const productDetail = await ProductService.getProductByUrl(params?.slug as string)
//     if (!productDetail) {
//       return {
//         notFound: true,
//       }
//     }
//     return {
//       props: {
//         productDetail: productDetail,
//         productRelated: productRelated?.result,
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching product:', error)
//     return {
//       notFound: true,
//     }
//   }
// }

const CollectionPage = ({}) => {
  const [productRootCategories, setProductRootCategories] = useState<IProductRootCategory[]>([])
  const [productCategories, setProductCategories] = useState<IProductCategory[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [filter, setFilter] = useState<Filter>({
    isNewIn: false,
    isDiscounted: false,
    isFeatured: false,
    sortType: EnumSortType.Default,
    genderProduct: EnumGenderProduct.All,
    productRootCategoryIds: [],
    productCategoryIds: [],
    keySearch: ''
  })

  return (
    <div className={`nc-CollectionPage`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">Man collection</h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              We not only help you design exceptional products, but also make it easy for you to share your designs with more like-minded people.
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <div>
            {/* TABS FILTER */}
            <TabFilter filter={filter} setFilter={setFilter} productRootCategories={productRootCategories} productCategories={productCategories}/>

            {/* LOOP ITEMS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              <ProductList />
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
              <Pagination pageNumber={pageNumber} pageCount={pageCount} setPageNumber={setPageNumber}/>
              <ButtonPrimary loading>Xem thêm</ButtonPrimary>
            </div>
          </div>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        <SliderCategoryList />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <PromoBanner1 />
      </div>
    </div>
  )
}

export default CollectionPage
