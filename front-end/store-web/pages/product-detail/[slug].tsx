import React, { useState } from 'react'
import LikeButton from '@/components/Product/LikeButton'
import { StarIcon } from '@heroicons/react/24/solid'
import Policy from '@/components/Product/Policy'
import ReviewItem from '@/components/Product/Review/ReviewItem'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import ModalViewAllReviews from '@/components/Product/Review/ModalViewAllReviews'
import Gallery from '@/components/Product/Gallery/Gallery'
import { GetServerSideProps } from 'next'
import ProductService from '@/services/product.service'
import { PageSizeConstants } from '@/constants/default.constants'
import PromoBanner2 from '@/components/Common/Banner/PromoBanner2'
import SliderProductList from '@/components/Common/ProductList/SliderProductList'
import SEO from '@/components/Layout/SEO'
import ProductInfo from '@/components/Product/ProductInfo'

interface IProps {
  productDetail: IProduct
  productRelated: IProduct[]
}

export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {
  const { params, req } = context
  try {
    const productDetail = await ProductService.getProductByUrl(params?.slug as string)
    if (!productDetail) {
      return {
        notFound: true,
      }
    }
    const getProductRelatedRequestModel: IGetProductsRequest = {
      pageNumber: 0,
      pageSize: PageSizeConstants.Default,
      keySearch: '',
      productCategoryIds: productDetail.productCategory?.id ? [productDetail?.productCategory?.id] : [],
      productRootCategoryIds: productDetail.productRootCategory?.id ? [productDetail?.productRootCategory?.id] : [],
      sortType: 0,
      isFeatured: false,
      isDiscounted: false,
    }
    const productRelated = await ProductService.getProducts(getProductRelatedRequestModel)
    return {
      props: {
        productDetail: productDetail,
        productRelated: productRelated?.result,
      },
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}

const ProductDetailPage = ({ productDetail, productRelated }: IProps) => {
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false)

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
          <p>
            The patented eighteen-inch hardwood Arrowhead deck --- finely mortised in, makes this the strongest and most rigid canoe ever built. You cannot buy
            a canoe that will afford greater satisfaction.
          </p>
          <p>
            The St. Louis Meramec Canoe Company was founded by Alfred Wickett in 1922. Wickett had previously worked for the Old Town Canoe Co from 1900 to
            1914. Manufacturing of the classic wooden canoes in Valley Park, Missouri ceased in 1978.
          </p>
          <ul>
            <li>Regular fit, mid-weight t-shirt</li>
            <li>Natural color, 100% premium combed organic cotton</li>
            <li>Quality cotton grown without the use of herbicides or pesticides - GOTS certified</li>
            <li>Soft touch water based printed in the USA</li>
          </ul>
        </div>
      </div>
    )
  }

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5"> 4,87 · 142 Reviews</span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            <ReviewItem />
            <ReviewItem
              data={{
                comment: `I love the charcoal heavyweight hoodie. Still looks new after plenty of washes. 
                  If you’re unsure which hoodie to pick.`,
                date: 'December 22, 2021',
                name: 'Stiven Hokinhs',
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. 
                Now that it’s colder, my husband wears his all the time. I wear hoodies all the time. `,
                date: 'August 15, 2022',
                name: 'Gropishta keo',
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. 
                The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,
                date: 'December 12, 2022',
                name: 'Dahon Stiven',
                starPoint: 5,
              }}
            />
          </div>

          <ButtonSecondary onClick={() => setIsOpenModalViewAllReviews(true)} className="mt-10 border border-slate-300 dark:border-slate-700 ">
            Show me all 142 reviews
          </ButtonSecondary>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title={'Trang chủ'} description="Describe the home" />
      <div className={`nc-ProductDetailPage `}>
        {/* MAIN */}
        <div className="container mt-5 lg:mt-11">
          <div className="lg:flex">
            {/* CONTENT */}
            <div className="w-full lg:w-[55%] ">
              {/* HEADING */}
              <div className="relative">
                <Gallery product={productDetail} />
                {/* <Image
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  src={LIST_IMAGES_DEMO[0]}
                  className="w-full rounded-2xl object-cover"
                  alt="product detail 1"
                /> */}
                <LikeButton className="absolute right-3 top-3 " productCode={productDetail.code}/>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
              <ProductInfo product={productDetail} showPolicy />
            </div>
          </div>

          {/* DETAIL AND REVIEW */}
          <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
            <div className="block xl:hidden">
              <Policy />
            </div>

            {renderDetailSection()}

            <hr className="border-slate-200 dark:border-slate-700" />

            {renderReviews()}

            <hr className="border-slate-200 dark:border-slate-700" />

            {/* OTHER SECTION */}
            <SliderProductList
              heading="Sản phẩm liên quan"
              subHeading=""
              headingFontClassName="text-2xl font-semibold"
              headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
              data={productRelated}
            />

            {/* SECTION */}
            {/* <div className="pb-20 xl:pb-28 lg:pt-14">
              <PromoBanner2 />
            </div> */}
          </div>
        </div>

        {/* MODAL VIEW ALL REVIEW */}
        <ModalViewAllReviews show={isOpenModalViewAllReviews} onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)} />
      </div>
    </>
  )
}

export default ProductDetailPage
