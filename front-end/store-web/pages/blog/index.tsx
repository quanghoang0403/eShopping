import React from 'react'
import SectionMagazine5 from '@/components/Blog/SectionMagazine5'
import SectionLatestPosts from '@/components/Blog/SectionLatestPosts'
import BgGlassmorphism from '@/shared/Background/BgGlassmorphism'

// DEMO DATA

const BlogPage: React.FC = () => {
  return (
    <div className="nc-BlogPage overflow-hidden relative">
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />
      {/* ======== ALL SECTIONS ======== */}
      <div className="container relative">
        <div className="pt-12 pb-16 lg:pb-28">
          <SectionMagazine5 />
        </div>
        <SectionLatestPosts className="py-16 lg:py-28" />
      </div>
    </div>
  )
}

export default BlogPage
