import React from 'react'
import SectionAds from '@/components/Blog/SectionAds'
import SectionMagazine5 from '@/components/Blog/SectionMagazine5'
import SectionLatestPosts from '@/components/Blog/SectionLatestPosts'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'
import PromoBanner3 from '@/components/Common/Banner/PromoBanner3'

// DEMO DATA

const BlogPage: React.FC = () => {
  return (
    <div className="nc-BlogPage overflow-hidden relative">
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />
      {/* ======== ALL SECTIONS ======== */}
      <div className="container relative">
        {/* === SECTION 1 === */}
        <div className="pt-12 pb-16 lg:pb-28">
          <SectionMagazine5 />
        </div>

        {/* === SECTION 1 === */}
        <SectionAds />

        {/* === SECTION 8 === */}
        <SectionLatestPosts className="py-16 lg:py-28" />

        {/* === SECTION 1 === */}
        <PromoBanner3 className="pb-16 lg:pb-28" />
      </div>
    </div>
  )
}

export default BlogPage