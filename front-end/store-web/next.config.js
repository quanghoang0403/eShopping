/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts')
const { use } = require('react')

module.exports = withFonts({
  transpilePackages: [],
  reactStrictMode: true,
  images: {
    domains: ['img.vietqr.io','eshoppingblob.blob.core.windows.net'],
  },
})
