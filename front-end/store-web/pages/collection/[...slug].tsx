import React, { memo, useEffect, useState } from 'react'
import Pagination from '@/shared/Pagination'
import TabFilter from '@/shared/Filter/TabFilter'
import PromoBanner1 from '@/components/Common/Banner/PromoBanner1'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import ProductList from '@/components/Common/ProductList/components/ProductList'
import { GetServerSideProps } from 'next'
import ProductCategoryService from '@/services/productCategory.service'
import SEO from '@/components/Layout/SEO'
import ProductService from '@/services/product.service'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { productActions } from '@/redux/features/productSlice'

export const getServerSideProps: GetServerSideProps<ICollectionDataResponse> = async (context) => {
  const { params, req } = context
  try {
    const res = await ProductCategoryService.getCollectionPageByUrl(params?.slug as string[])
    if (!res) {
      return {
        notFound: true,
      }
    }
    return {
      props: res,
    }
  } catch (error) {
    console.error('Error fetching collection page:', error)
    return {
      notFound: true,
    }
  }
}

const CollectionPage = ({ 
  genderProduct, 
  productRootCategoryId, 
  productCategoryId,
  productRootCategories,
  productCategories,
  name,
  description,
  descriptionSEO,
  titleSEO,
  keywordSEO
}: ICollectionDataResponse) => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [pageCount, setPageCount] = useState(1)
  const getProductRequest = useAppSelector((state) => state.product.getProductRequest as IGetProductsRequest)
  const dispatch = useAppDispatch()

  const fetchProducts = async (request?: IGetProductsRequest) => {
    const resFilter = await ProductService.getProducts(request ?? getProductRequest)
    if (resFilter) {
      setProducts(resFilter.result)
      setPageCount(resFilter.paging.pageCount)
    }
  }

  useEffect(() => {
    const newGetProductRequest = {
      ...getProductRequest,
      genderProduct: genderProduct,
      productRootCategoryIds: productRootCategoryId ? [productRootCategoryId] : [],
      productCategoryIds: productCategoryId ? [productCategoryId] : [],
    }
    dispatch(productActions.updateRequest(newGetProductRequest))
    fetchProducts(newGetProductRequest)
  }, [productRootCategoryId, productCategoryId, genderProduct])

  return (
    <>
      <SEO title={titleSEO ?? name} description={descriptionSEO ?? description} />
      <div className={`nc-CollectionPage`}>
        <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
          <div className="space-y-10 lg:space-y-14">
            {/* HEADING */}
            <div className="max-w-screen-sm">
              <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">{name}</h2>
              <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">{description}</span>
            </div>

            <hr className="border-slate-200 dark:border-slate-700" />
            <div>
              {/* TABS FILTER */}
              <TabFilter
                onApply={fetchProducts}
                productRootCategories={productRootCategories}
                productCategories={productCategories.filter((c) => getProductRequest.productRootCategoryIds.includes(c.productRootCategoryId))}
              />

              {/* LOOP ITEMS */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
                <ProductList data={products} />
              </div>

              {/* PAGINATION */}
              {pageCount > 1 && (
                <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
                  <Pagination onApply={fetchProducts} pageCount={pageCount} />
                  {/* <ButtonPrimary onClick={() => setFilter((prevFilter) => ({ ...prevFilter, pageNumber: filter.pageNumber + 1 }))} loading>
                    Xem thêm
                  </ButtonPrimary> */}
                </div>
              )}
            </div>
          </div>

          {/* === SECTION 5 === */}
          <hr className="border-slate-200 dark:border-slate-700" />

          <SliderCategoryList />
          <hr className="border-slate-200 dark:border-slate-700" />

          {/* SUBCRIBES */}
          {/* <PromoBanner1 /> */}
        </div>
      </div>
    </>
  )
}

export default CollectionPage
