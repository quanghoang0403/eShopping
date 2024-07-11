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
        <h2 className="text-2xl font-semibold">Chi tiết sản phẩm</h2>
        {productDetail.content && (
          <div
            className="product-content prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7"
            dangerouslySetInnerHTML={{ __html: productDetail.content }}
          >
            {/* <p>
                  Sản phẩm đẹp với chất liệu vải dệt Arrowhead gỗ sồi 18 inch, tạo nên sản phẩm càng chắc chắn và thoải mái hơn bao giờ hết. Bạn không thể mua được
                  sản phẩm nào mang lại hài lòng cao hơn.
                </p>
                <p>
                  Công ty St. Louis Meramec được thành lập bởi Alfred Wickett vào năm 1922. Wickett đã từng làm việc cho Old Town Canoe Co từ năm 1900 đến 1914. Việc
                  sản xuất các sản phẩm cổ điển tại Valley Park, Missouri đã ngừng vào năm 1978.
                </p>
                <ul>
                  <li>Váy phù hợp, áo thun trung bình</li>
                  <li>Màu tự nhiên, 100% bông hữu cơ cao cấp được sử dụng sau khi lông được tẩy lông</li>
                  <li>Bông cotton chất lượng được trồng không sử dụng thuốc diệt cỏ hoặc thuốc trừ sâu - được chứng nhận GOTS</li>
                  <li>Được in mực nước mềm mại tại Mỹ</li>
                </ul> */}
          </div>
        )}
      </div>
    )
  }

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          {/* <span className="ml-1.5"> 4,87 · 142 Đánh giá</span> */}
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
            Xem 142 lượt đánh giá
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
                <LikeButton className="absolute right-3 top-3 " productId={productDetail.id} />
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

            {/* <hr className="border-slate-200 dark:border-slate-700" /> */}

            {/* {renderReviews()} */}

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
