import React from 'react'
import SectionHowItWork from '@/components/Home/SectionHowItWork'
import SEO from '@/components/Layout/SEO'
import SectionHeroSingle from '@/components/Common/SectionHero/SectionHeroSingle'
import SliderProductList from '@/components/Common/ProductList/SliderProductList'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import { GetServerSideProps } from 'next'
import ProductCategoryService from '@/services/productCategory.service'


export const getServerSideProps: GetServerSideProps<IHomeDataResponse> = async () => {
  try {
    const res = await ProductCategoryService.getHomePage()
    if (res) {
      return {
        props: res,
      }
    }
    return {
      notFound: true,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}

export default function HomePage({ discountedProducts, featuredProducts, newInProducts }: IHomeDataResponse) {
  return (
    <>
      <SEO title={'Trang chủ'} description="Describe the home" />
      <div className="nc-PageHome relative overflow-hidden">
        <SectionHeroSingle />
        <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
          <SliderProductList data={discountedProducts} heading="Khuyến mãi khủng" subHeading="Tưng bừng mua sắm" />
          <SliderProductList data={featuredProducts} heading="Sản phẩm nổi bật" subHeading="Trở nên khác biệt" />
          <SliderProductList data={newInProducts} heading="Sản phẩm mới về" subHeading="Tự tin tạo khác biệt" />
          <SliderCategoryList />
          <div className="pt-24 lg:pt-32 border-t border-slate-200 dark:border-slate-700">
            <SectionHowItWork />
          </div>
        </div>
      </div>
    </>
  )
}
