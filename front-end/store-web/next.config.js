/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts')
const { use } = require('react')

module.exports = withFonts({
  transpilePackages: [],
  reactStrictMode: true,
  // images: {
  //   domains: ['images.unsplash.com', 'tailwindui.com','lh3.googleusercontent.com'],
  // },
})
