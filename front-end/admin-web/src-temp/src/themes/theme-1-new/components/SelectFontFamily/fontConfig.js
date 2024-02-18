export const fonts = [
  {
    name: "Plus Jakarta Sans",
    path: "https://fonts.googleapis.com/css?family=Plus+Jakarta+Sans",
  },
  {
    name: "Cormorant Garamond",
    path: "https://fonts.googleapis.com/css?family=Cormorant+Garamond",
  },
  {
    name: "Dancing Script",
    path: "https://fonts.googleapis.com/css?family=Dancing+Script",
  },
  {
    name: "EB Garamond",
    path: "https://fonts.googleapis.com/css?family=EB+Garamond",
  },
  {
    name: "Josefin Sans",
    path: "https://fonts.googleapis.com/css?family=Josefin+Sans",
  },
  {
    name: "Libre Bodoni",
    path: "https://fonts.googleapis.com/css?family=Libre+Bodoni",
  },
  {
    name: "Literata",
    path: "https://fonts.googleapis.com/css?family=Literata",
  },
  {
    name: "Montserrat",
    path: "https://fonts.googleapis.com/css?family=Montserrat",
  },
  {
    name: "Montserrat Alternates",
    path: "https://fonts.googleapis.com/css?family=Montserrat+Alternates",
  },
  {
    name: "Noto Serif Display",
    path: "https://fonts.googleapis.com/css?family=Noto+Serif+Display",
  },
  {
    name: "Nunito",
    path: "https://fonts.googleapis.com/css?family=Nunito",
  },
  {
    name: "Open Sans",
    path: "https://fonts.googleapis.com/css?family=Open+Sans",
  },
  {
    name: "Oswald",
    path: "https://fonts.googleapis.com/css?family=Oswald",
  },
  {
    name: "Petrona",
    path: "https://fonts.googleapis.com/css?family=Petrona",
  },
  {
    name: "Playfair Display",
    path: "https://fonts.googleapis.com/css?family=Playfair+Display",
  },
  {
    name: "Roboto",
    path: "https://fonts.googleapis.com/css?family=Roboto",
  },
  {
    name: "Source San Pro",
    path: "https://fonts.cdnfonts.com/css/source-sans-pro",
  },
  {
    name: "Vollkorn",
    path: "https://fonts.googleapis.com/css?family=Vollkorn",
  },
  {
    name: "SF Pro Display",
    path: "https://fonts.cdnfonts.com/css/sf-pro-display",
  },
  {
    name: "Geomanist",
    path: "https://fonts.cdnfonts.com/css/geomanist",
  },
  {
    name: "Lato",
    path: "https://fonts.googleapis.com/css?family=Lato",
  },
  {
    name: "Noto Sans Display",
    path: "https://fonts.googleapis.com/css?family=Noto+Sans+Display",
  },
  {
    name: "SF Compact",
    path: "https://fonts.cdnfonts.com/css/sf-compact-display",
  },
  {
    name: "Roboto Condensed",
    path: "https://fonts.googleapis.com/css?family=Roboto+Condensed",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const isExistLink = (links, link) => {
  if (Array.isArray(links)) {
    return links?.some((element) => element.href === link.href);
  }
 
  return false;
};

export const addFont = (path) => {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", path);
  var head = document.head;
  var links = head.querySelectorAll("link");
  if (Boolean(links)) {
    const _isExistLink = isExistLink(links, link);
    if (_isExistLink === false) {
      document.head.insertBefore(link, document.head.firstChild);
    }
  }
};

export const initFonts = () => {
  for (let i = 0; i < fonts.length; i++) {
    const path = fonts[i].path;
    addFont(path);
  }
};
