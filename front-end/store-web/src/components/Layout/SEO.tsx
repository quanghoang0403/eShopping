import Head from 'next/head'

const siteUrl = 'https://codeconcisely.com'

export default function SEO({
  title = 'Awesome Website',
  description = 'Learn cool stuff from a collection of awesome things.',
  ogImgUrl = '/og-image.png',
  ogUrl = siteUrl,
}) {
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        <meta key="og:image" property="og:image" content={ogImgUrl} />
        <meta key="og:url" property="og:url" content={ogUrl} />
        <meta
          key="twitter:card"
          property="twitter:card"
          content="summary_large_image"
        />
      </Head>
    </>
  )
}
