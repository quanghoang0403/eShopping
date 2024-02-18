import { Helmet } from "react-helmet-async";
const jsonConfig = localStorage.getItem("config");
const storeConfig = JSON.parse(jsonConfig);
const STORE_NAME = storeConfig?.storeName ?? "";
const DEFAULT_LANG = "vi";
const DEFAULT_LOCALE = "vi";
const MetaInfo = ({
  meta = [],
  defer = false,
  lang = DEFAULT_LANG,
  title = "Store web",
  locale = DEFAULT_LOCALE,
  description = "Store web",
  storeName = STORE_NAME,
  author = "",
}) => {
  const url = window?.location.href || "unknown";
  const baseUrl = window?.location.host || "unknown";
  return (
    <Helmet
      defer={defer}
      title={title}
      htmlAttributes={{ lang }}
      titleTemplate={`${storeName} - %s`}
      link={[
        {
          rel: "canonical",
          href: url,
        },
      ]}
      meta={[
        {
          name: "description",
          content: description,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:site_name",
          content: storeName,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: url,
        },
        {
          property: "og:locale",
          content: locale,
        },
        {
          property: "og:image",
          content: `${baseUrl}/logo192.png`,
        },
        {
          name: "author",
          content: author,
        },
      ].concat(meta)}
    />
  );
};

export default MetaInfo;
