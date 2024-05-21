import React from 'react'
import SectionHowItWork from '@/components/Home/SectionHowItWork'
import BackgroundSection from '@/shared/Background/BackgroundSection'
import Heading from '@/shared/Heading'
import ButtonSecondary from '@/shared/Button/ButtonSecondary'
import { PRODUCTS, SPORT_PRODUCTS } from '@/data/data'
import SEO from '@/components/Layout/SEO'
import SectionHeroSingle from '@/components/Home/SectionHero/SectionHeroSingle'
import PromoBanner1 from '@/components/Common/Banner/PromoBanner1'
import PromoBanner2 from '@/components/Common/Banner/PromoBanner2'
import PromoBanner3 from '@/components/Common/Banner/PromoBanner3'
import LargeProductList from '@/components/Common/ProductList/LargeProductList'
import SliderProductList from '@/components/Common/ProductList/SliderProductList'
import GridCategoryList from '@/components/Common/CategoryList/GridCategoryList'
import SliderCategoryList from '@/components/Common/CategoryList/SliderCategoryList'
import GridFeatureProductList from '@/components/Common/ProductList/GridFeatureProductList'

function PageHome() {
  return (
    <>
      <SEO title={'Trang chủ'} description="Describe the home page" />
      <div className="nc-PageHome relative overflow-hidden">
        <SectionHeroSingle />

        <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
          <SliderProductList data={[PRODUCTS[4], SPORT_PRODUCTS[5], PRODUCTS[7], SPORT_PRODUCTS[1], PRODUCTS[6]]} />
          <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
            <SectionHowItWork />
          </div>
          <PromoBanner1 />

          <div className="relative py-24 lg:py-32">
            <BackgroundSection />
            <GridCategoryList />
          </div>

          <SliderProductList heading="Best Sellers" subHeading="Best selling of the month" />

          <PromoBanner2 />

          <LargeProductList />

          <SliderCategoryList />

          <PromoBanner3 />

          <GridFeatureProductList />

          <div className="relative py-24 lg:py-32">
            <BackgroundSection />
            <div>
              <Heading rightDescText="From the Ciseco blog">The latest news</Heading>
              {/* <SectionMagazine5 /> */}
              <div className="flex mt-16 justify-center">
                <ButtonSecondary>Show all blog articles</ButtonSecondary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageHome
