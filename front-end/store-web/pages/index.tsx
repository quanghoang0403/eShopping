import React from 'react'
import SectionHowItWork from '@/components/Home/SectionHowItWork'
import SEO from '@/components/Layout/SEO'
import SectionHeroSingle from '@/components/Home/SectionHero/SectionHeroSingle'
import SliderProductList from '@/components/Common/ProductList/SliderProductList'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import { GetServerSideProps } from 'next'
import { PageSizeConstants } from '@/constants/default.constants'
import ProductService from '@/services/product.service'

interface HomePageProps {
  discountedProduct: IProduct[]
  featuredProduct: IProduct[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    let discountedRequest: IGetProductsRequest = {
      isDiscounted: true,
      isFeatured: false,
      keySearch: '',
      pageNumber: 0,
      pageSize: PageSizeConstants.Default,
      sortType: 0,
    }
    const discountedRes = await ProductService.getProducts(discountedRequest)
    const featuredRequest: IGetProductsRequest = { ...discountedRequest, isDiscounted: false, isFeatured: true }
    const featuredRes = await ProductService.getProducts(featuredRequest)
    console.log(discountedRes)
    return {
      props: {
        discountedProduct: discountedRes.result,
        featuredProduct: featuredRes.result,
      },
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}

export default function HomePage({ discountedProduct, featuredProduct }: HomePageProps) {
  return (
    <>
      <SEO title={'Trang chủ'} description="Describe the home" />
      <div className="nc-PageHome relative overflow-hidden">
        <SectionHeroSingle />
        <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
          <SliderProductList data={featuredProduct} heading="Sản phẩm nổi bật" subHeading="Trở nên khác biệt" />
          <SliderProductList data={discountedProduct} heading="Khuyến mãi khủng" subHeading="Tưng bừng mua sắm" />
          <SliderCategoryList />
          <div className="pt-24 lg:pt-32 border-t border-slate-200 dark:border-slate-700">
            <SectionHowItWork />
          </div>
        </div>
      </div>
    </>
  )
}
