'use client'

import React, { FC, useEffect, useState } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import LikeButton from '@/components/Product/LikeButton'
import { StarIcon } from '@heroicons/react/24/solid'
import BagIcon from '@/shared/Icon/BagIcon'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Price from '@/shared/Price'
import toast from 'react-hot-toast'
import detail1JPG from '@/images/products/detail1.jpg'
import detail2JPG from '@/images/products/detail2.jpg'
import detail3JPG from '@/images/products/detail3.jpg'
import Policy from '@/components/Product/Policy'
import ReviewItem from '@/components/Product/Review/ReviewItem'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import ModalViewAllReviews from '@/components/Product/Review/ModalViewAllReviews'
import NotifyAddTocart from '@/components/Product/NotifyAddTocart'
import AccordionInfo from '@/components/Product/AccordionInfo'
import Gallery from '@/components/Product/Gallery/Gallery'
import { GetServerSideProps, GetStaticProps } from 'next'
import ProductService from '@/services/product.service'
import { PageSizeConstants } from '@/constants/default.constants'
import PromoBanner2 from '@/components/Common/Banner/PromoBanner2'
import SliderProductList from '@/components/Common/ProductList/SliderProductList'
import { useAppDispatch } from '@/hooks/useRedux'
import { sessionActions } from '@/redux/features/sessionSlice'

const LIST_IMAGES_DEMO = [
  detail1JPG,
  detail2JPG,
  detail3JPG,
  detail1JPG,
  detail2JPG,
  detail3JPG,
  detail1JPG,
  detail2JPG,
  detail3JPG,
  detail1JPG,
  detail2JPG,
  detail3JPG,
]

interface IProps {
  productDetail: IProductDetail
  productRelated: IProduct[]
}

// export const getServerSideProps: GetServerSideProps<IProps> = async (context) => {
//   const { params, req } = context
//   const slug = params?.url

//   try {
//     const productDetail = await ProductService.getProductByUrl(slug as string)
//     const getProductRelatedRequestModel: IGetProductsRequest = {
//       pageNumber: 0,
//       pageSize: PageSizeConstants.Default,
//       keySearch: '',
//       productCategoryId: productDetail?.productCategory?.id as string,
//       sortType: 0,
//       isFeatured: false,
//       isDiscounted: false,
//     }
//     const productRelated = await ProductService.getProducts(getProductRelatedRequestModel)
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

//const ProductDetailPage = ({ productDetail, productRelated }: IProps) => {
const ProductDetailPage = () => {
  const productDetail = {
    code: 84,
    viewCount: 0,
    isFeatured: true,
    isDiscounted: true,
    status: 1,
    priority: 0,
    thumbnail: 'https://eshoppingblob.blob.core.windows.net/uploaddev/27042024191521.png',
    productCategories: [
      {
        id: 'e26163b9-30d2-475d-49c9-08dc5e246ecd',
        no: 0,
        name: 'asdasd',
        isShowOnHome: false,
        priority: 1,
        numberOfProduct: 0,
      },
    ],
    productPrices: [
      {
        id: '9d4b8a96-b1e6-43b5-bffa-08dc66b3bdd1',
        priceName: 'Xanh',
        priceValue: 200000,
        priceDiscount: 0,
        percentNumber: 10,
        quantityLeft: 61,
        thumbnail: 'https://eshoppingblob.blob.core.windows.net/uploaddev/27042024191521.png',
      },
      {
        id: '9d4b8a96-b1e6-43b5-bffa-08dc66b3bdd2',
        priceName: 'Đỏ',
        priceValue: 13000,
        priceDiscount: 12332,
        percentNumber: 10,
        quantityLeft: 61,
        thumbnail: 'https://eshoppingblob.blob.core.windows.net/uploaddev/27042024191521.png',
      },
    ],
    gallery: ['https://eshoppingblob.blob.core.windows.net/uploaddev/27042024191521.png'],
    id: '40fed1f2-e668-40b3-f5fa-08dc66b3bd8a',
    name: '323',
    content: '',
    keywordSEO: 'wqeqwe',
    urlSEO: '323',
  } as IProductDetail
  const { productPrices } = productDetail
  const [variantActive, setVariantActive] = useState(0)
  const dispatch = useAppDispatch()

  const handleAddProduct = () => {
    const cartItem: ICartItem = {
      productId: productDetail.id,
      productName: productDetail.name,
      productUrl: productDetail.urlSEO,
      productPriceId: productPrices[variantActive].id,
      priceName: productPrices[variantActive].priceName,
      priceValue: productPrices[variantActive].priceValue,
      priceDiscount: productPrices[variantActive].priceDiscount,
      percentNumber: productPrices[variantActive].percentNumber,
      thumbnail: productPrices[variantActive].thumbnail ?? productDetail.thumbnail,
      quantity: 1,
      quantityLeft: productPrices[variantActive].quantityLeft,
    }
    dispatch(sessionActions.addProductToCart(cartItem))
    toast.custom((t) => <NotifyAddTocart item={cartItem} show={t.visible} />, { position: 'top-right', id: 'nc-product-notify', duration: 3000 })
  }
  // const [sizeSelected, setSizeSelected] = useState(sizes ? sizes[0] : '')
  const [qualitySelected, setQualitySelected] = useState(1)
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false)

  const renderVariants = () => {
    if (!productPrices || !productPrices.length) {
      return null
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            <span className="ml-1 font-semibold">{productPrices[variantActive].priceName}</span>
          </span>
        </label>
        <div className="flex mt-3">
          {productPrices.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${
                variantActive === index ? 'border-primary-6000 dark:border-primary-500' : 'border-transparent'
              }`}
            >
              <div
                className="absolute inset-0.5 rounded-full overflow-hidden z-0 object-cover bg-cover"
                style={{
                  backgroundImage: `url(${
                    // @ts-ignore
                    typeof variant.thumbnail?.src === 'string'
                      ? // @ts-ignore
                        variant.thumbnail?.src
                      : typeof variant.thumbnail === 'string'
                      ? variant.thumbnail
                      : ''
                  })`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // const renderSizeList = () => {
  //   if (!  || !sizes || !sizes.length) {
  //     return null
  //   }
  //   return (
  //     <div>
  //       <div className="flex justify-between font-medium text-sm">
  //         <label htmlFor="">
  //           <span className="">
  //             Size:
  //             <span className="ml-1 font-semibold">{sizeSelected}</span>
  //           </span>
  //         </label>
  //         <a target="_blank" rel="noopener noreferrer" href="##" className="text-primary-6000 hover:text-primary-500">
  //           See sizing chart
  //         </a>
  //       </div>
  //       <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
  //         {allOfSizes.map((size, index) => {
  //           const isActive = size === sizeSelected
  //           const sizeOutStock = !sizes.includes(size)
  //           return (
  //             <div
  //               key={index}
  //               className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center
  //               text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${
  //                 sizeOutStock ? 'text-opacity-20 dark:text-opacity-20 cursor-not-allowed' : 'cursor-pointer'
  //               } ${
  //                 isActive
  //                   ? 'bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000'
  //                   : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
  //               }`}
  //               onClick={() => {
  //                 if (sizeOutStock) {
  //                   return
  //                 }
  //                 setSizeSelected(size)
  //               }}
  //             >
  //               {size}
  //             </div>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   )
  // }

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">{productDetail.name}</h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Price
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-2xl font-semibold"
              priceValue={productPrices[variantActive].priceValue}
              priceDiscount={productPrices[variantActive].priceDiscount}
            />

            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <a href="#reviews" className="flex items-center text-sm font-medium">
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>4.9</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">142 reviews</span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ml-1 leading-none">Mới về</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>
        {/* <div className="">{renderSizeList()}</div> */}

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          {/* <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber defaultValue={qualitySelected} onChange={setQualitySelected} />
          </div> */}
          <ButtonPrimary className="flex-1 flex-shrink-0" onClick={handleAddProduct}>
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">THÊM VÀO GIỎ HÀNG</span>
          </ButtonPrimary>
        </div>

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo />

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />
        </div>
      </div>
    )
  }

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
    <div className={`nc-ProductDetailPage `}>
      {/* MAIn */}
      <div className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">
              <div className="relative">
                <Gallery images={LIST_IMAGES_DEMO} status={'50% Discount'} />
                {/* <Image
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  src={LIST_IMAGES_DEMO[0]}
                  className="w-full rounded-2xl object-cover"
                  alt="product detail 1"
                /> */}
              </div>
              {/* META FAVORITES */}
              <LikeButton className="absolute right-3 top-3 " />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">{renderSectionContent()}</div>
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
            // data={productRelated}
          />

          {/* SECTION */}
          <div className="pb-20 xl:pb-28 lg:pt-14">
            <PromoBanner2 />
          </div>
        </div>
      </div>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews show={isOpenModalViewAllReviews} onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)} />
    </div>
  )
}

export default ProductDetailPage
