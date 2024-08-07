import React, { useEffect, useState } from 'react'
import Pagination from '@/shared/Pagination'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import ButtonCircle from '@/shared/Button/ButtonCircle'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import Input from '@/shared/Controller/Input'
import ProductList from '@/components/Common/ProductList/components/ProductList'
import TabFilter from '@/shared/Filter/TabFilter'
import Nav from '@/shared/Nav'
import NavItem from '@/shared/NavItem'
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import ProductService from '@/services/product.service'
import ProductCategoryService from '@/services/productCategory.service'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { productActions } from '@/redux/features/productSlice'
import { mappingProductGender } from '@/enums/enumGenderProduct'

export const getServerSideProps: GetServerSideProps<ISearchDataResponse> = async (context) => {
  const { query } = context
  try {
    const keySearch = query.keySearch as string
    const res = await ProductCategoryService.getSearchPage(keySearch ?? '')
    if (!res) {
      return {
        notFound: true,
      }
    }
    return {
      props: res,
    }
  } catch (error) {
    console.error('Error fetching search page:', error)
    return {
      notFound: true,
    }
  }
}

const SearchPage = ({ keySearch, productRootCategories, productCategories }: ISearchDataResponse) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
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
      keySearch: keySearch,
    }
    dispatch(productActions.updateRequest(newGetProductRequest))
    fetchProducts(newGetProductRequest)
  }, [keySearch])

  return (
    <div className={`nc-SearchPage`} data-nc-id="SearchPage">
      <div className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `} />
      <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          <form
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault()
              const query = getProductRequest.keySearch ? `?keySearch=${encodeURIComponent(getProductRequest.keySearch)}` : ''
              router.push(`/search${query}`)
            }}
          >
            <label htmlFor="search-input" className="text-neutral-500 dark:text-neutral-300">
              <span className="sr-only">Tìm kiếm</span>
              <Input
                value={getProductRequest.keySearch}
                onChange={(event) => dispatch(productActions.updateRequest({ ...getProductRequest, keySearch: event.target.value }))}
                className="shadow-lg border-0 dark:border"
                placeholder="Nhập từ khoá"
                sizeClass="pl-14 py-5 pr-5 md:pl-16"
                rounded="rounded-full"
              />
              <ButtonCircle className="absolute right-2.5 top-1/2 transform -translate-y-1/2" size=" w-11 h-11">
                <i className="las la-arrow-right text-xl"></i>
              </ButtonCircle>
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </label>
          </form>
        </header>
      </div>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <div>
          {/* FILTER */}
          <div className="flex flex-col relative mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0 lg:space-x-2 ">
              <Nav className="sm:space-x-2" containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar">
                {mappingProductGender.map((item, index) => (
                  <NavItem
                    key={index}
                    isActive={getProductRequest.genderProduct == item.id}
                    onClick={() => dispatch(productActions.updateRequest({ ...getProductRequest, genderProduct: item.id }))}
                  >
                    {item.name}
                  </NavItem>
                ))}
              </Nav>
              <span className="block flex-shrink-0 text-right">
                <ButtonPrimary
                  className="w-auto !pr-16"
                  sizeClass="pl-4 py-2.5 sm:pl-6"
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                >
                  <svg className={`w-4 h-4 sm:w-6 sm:h-6`} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14.3201 19.07C14.3201 19.68 13.92 20.48 13.41 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.47006 13.01 8.06006 12.51L4.22003 8.47C3.71003 7.96 3.31006 7.06001 3.31006 6.45001V4.13C3.31006 2.92 4.22008 2.01001 5.33008 2.01001H18.67C19.78 2.01001 20.6901 2.92 20.6901 4.03V6.25C20.6901 7.06 20.1801 8.07001 19.6801 8.57001"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.07 16.52C17.8373 16.52 19.27 15.0873 19.27 13.32C19.27 11.5527 17.8373 10.12 16.07 10.12C14.3027 10.12 12.87 11.5527 12.87 13.32C12.87 15.0873 14.3027 16.52 16.07 16.52Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M19.87 17.12L18.87 16.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <span className="block truncate ml-2.5">Filter</span>
                  <span className="absolute top-1/2 -translate-y-1/2 right-5">
                    <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </span>
                </ButtonPrimary>
              </span>
            </div>
            <Transition
              show={isOpen}
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700 my-8"></div>
              <TabFilter
                onApply={fetchProducts}
                productRootCategories={productRootCategories}
                productCategories={productCategories.filter((c) => getProductRequest.productRootCategoryIds.includes(c.productRootCategoryId))}
              />
            </Transition>
          </div>

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

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />
        <SliderCategoryList />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        {/* <PromoBanner1 /> */}
      </div>
    </div>
  )
}

export default SearchPage
