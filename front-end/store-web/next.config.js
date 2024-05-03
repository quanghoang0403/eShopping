/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts')
const { use } = require('react')

module.exports = withFonts({
  transpilePackages: [],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'eshoppingblob.blob.core.windows.net',
        pathname: '**',
      },
    ],
  },
})
