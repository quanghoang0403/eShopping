import { Hyperlink } from "./constants/hyperlink.constants";

const { default: PageType } = require("./constants/page-type.constants");

const defaultConfig = {
  themeId: "46565F44-C3E2-449D-8D58-3850A95FFBA7",
  storeThemeId: null,
  currencyCode: "VND",
  currencySymbol: "đ",
  general: {
    generalBackground: {
      backgroundType: 1,
      backgroundColor: "rgba(255, 255, 255, 1)",
      backgroundImage: "/images/default-theme/background-default.png",
    },
    color: {
      colorGroups: [
        {
          id: "332c77be-1174-4859-8187-f01e0c40cb59",
          name: "Color Group Default",
          titleColor: "rgba(219, 77, 41, 1)",
          textColor: "rgba(0, 0, 0, 1)",
          buttonBackgroundColor: "rgba(219,77,41,1)",
          buttonTextColor: "rgba(255,255,255,1)",
          buttonBorderColor: "transparent",
          isDefault: true,
        },
      ],
    },
    header: {
      backgroundType: 1,
      backgroundColor: "rgba(219, 77, 41, 1)",
      backgroundImage: null,
      colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
      logoUrl: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14122022233901.png",
      menuId: null,
      scrollType: 1,
      menuItems: [
        {
          url: "/",
          name: "menu.home",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/",
          name: "menu.introduce",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/product-list",
          name: "menu.menu",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/blog",
          name: "menu.blog",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/contact",
          name: "menu.contact",
          hyperlinkOption: Hyperlink.URL,
        },
      ],
    },
    footer: {
      generalCustomization: {
        backgroundType: 2,
        backgroundColor: "rgba(255,255,255,1)",
        backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14122022233404.png",
        colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
      },
      logo: {
        visible: true,
        logoUrl: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14122022233901.png",
      },
      storeInformation: {
        headOffice: null,
        phoneNumber: null,
        email: "hotro@gosell.com",
        email1: null,
        storeName: "CỬA HÀNG PHỞ VIỆT",
        address: "60A Trường Sơn, Phường 2, Quận Tân Bình, Hồ Chí Minh, Việt Nam 2 ",
        hotline: "(028) 7303 0800",
        showAllBranch: false,
        visible: true,
        numberOfBranches: 0,
      },
      menu: {
        menuTitle: "ABOUT US",
        menuId: null,
        menuItems: [
          {
            url: "#",
            name: "Trang chủ",
          },
          {
            url: "#",
            name: "Giới thiệu",
          },
          {
            url: "#",
            name: "Thực đơn",
          },
          {
            url: "#",
            name: "Blog",
          },
          {
            url: "#",
            name: "Liên hệ",
          },
        ],
        visible: true,
      },
      businessLicense: {
        businessLicenseURL: "",
        visible: true,
      },
      policy: {
        menuId: null,
        visible: true,
        menuItems: [
          {
            url: "#",
            name: "Chính sách và quy định chung",
          },
          {
            url: "#",
            name: "Chính sách hoạt động",
          },
          {
            url: "#",
            name: "Chính sách bảo mật thông tin",
          },
        ],
      },
      socialNetwork: {
        socialNetworkTitle: "KẾT NỐI VỚI CHÚNG TÔI",
        isFacebook: false,
        facebookURL: "",
        isInstagram: true,
        instagramURL: "https://www.instagram.com/Gosell.vn",
        isTiktok: true,
        tiktokURL: "https://www.tiktok.com/Gosell.vn",
        isTwitter: false,
        twitterURL: "",
        isYoutube: true,
        youtubeURL: "https://www.youtube.com/Gosell.vn",
        visible: true,
      },
      copyRight: {
        copyRightText: "Copyright © 2022 Pho Viet",
        visible: true,
      },
      downloadApp: {
        downloadAppTitle: "",
        appStoreImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/14082023163303.png",
        googlePlayImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/14082023163401.png",
        visible: true,
        qrCodeImage: null,
        qrCode: false,
        appStore: false,
        appStoreLink: "",
        googlePlay: false,
        googlePlayLink: "",
      },
    },
    favicon: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/21122022131915.ico",
    appLogo: "",
    font: {
      name: "Montserrat",
      path: "https://fonts.googleapis.com/css?family=Montserrat"
    }
  },
  pages: [
    {
      id: "726F7453-5765-6265-5061-676500000001",
      config: {
        slideShow: {},
        category: {},
        bestSellingProduct: {},
        signatureProduct: {},
        booking: {},
        blogs: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255, 255, 255, 1)",
            backgroundImage: "/images/default-theme/background-default-blog-theme-2.png",
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          headerText: "TIN TỨC & KHUYẾN MÃI",
          titleText: "Bài viết nổi bật",
          visible: true,
        },
        branches: {},
        todayMenu: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255, 255, 255, 1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          headerText: "MENU SPECIAL",
          titleText: "Todays Special Menu",
          visible: true,
        },
        banner: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
          bannerList: [
            {
              imageUrl: "/images/default-theme/theme2-banner-default.png",
              hyperlinkType: null,
              hyperlinkValue: null,
            },
          ],
          visible: true,
        },
        advertisement: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          advertisementItems: [
            {
              imageUrl: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13012023130807.png",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              imageUrl: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13012023130907.png",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
          ],
          visible: true,
        },
        introduction: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          introductionCustomization: {
            image: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/06012023154802.png",
            header: "GIỚI THIỆU",
            title: "Tận hưởng một hành trình đặc biệt của hương vị",
            description: '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas integer nunc mi, ac aliquet pretium platea. Nisl eu nulla nunc, risus eu, volutpat. Blandit in cursus purus nibh. Felis mattis cras morbi a, viverra est arcu ligula sapien. Eu sagittis felis purus urna. Cras purus quis tincidunt cursus id.</div><div><br/><div><div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas integer nunc mi, ac aliquet pretium platea.</div></div></div><div><br/><div><div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas integer nunc mi, ac aliquet pretium platea.</div></div></div>',
            buttonLabel: "XEM THÊM",
            hyperlink: null,
            url: null,
            sections: [
              {
                id: "1",
                icon: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/06012023154944.png",
                header: "BEST QUALITY",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                hyperlink: null,
                url: null,
                isDefault: true,
              },
              {
                id: "2",
                icon: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/06012023155045.png",
                header: "ON TIME",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                hyperlink: null,
                url: null,
                isDefault: false,
              },
              {
                id: "3",
                icon: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/06012023155122.png",
                header: "MASTERCHEFS",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                hyperlink: null,
                url: null,
                isDefault: false,
              },
              {
                id: "4",
                icon: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/06012023155150.png",
                header: "TASTE FOOD",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                hyperlink: null,
                url: null,
                isDefault: false,
              },
            ],
          },
          visible: true,
        },
        flashSale: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          visible: true,
        },
        promotionSection: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          generalComponentCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          visible: true,
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000002",
      config: {
        header: {
          title: "Thực Đơn",
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/15122022101954.png",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
        },
        productsProductList: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/17102023113152.png",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000003", // product detail
      config: {
        header: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
        },
        productDetail: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
        },
        relatedProducts: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
          title: "Related product",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000004", // combo detail
      config: {
        header: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
        },
        productDetail: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
        },
        relatedProducts: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
          title: "Related product",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000005",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-676500000006",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-676500000007",
      config: {
        header: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/15122022101954.png",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          visible: true,
        },
        checkout: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: null,
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          visible: true,
        },
        relatedProducts: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/15122022102333.png",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          categoryId: "",
          visible: true,
          title: "Related Products",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000008",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-676500000009", //Login
      config: {
        backgroundType: 1,
        backgroundColor: "rgba(255,255,255,1)",
        backgroundImage: "/images/default-theme/background-default-login-theme-2.png",
        colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
        title: "Đăng nhập",
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000B",
      config: {
        backgroundType: 1,
        backgroundColor: "rgba(244,244,244,100)",
        backgroundImage: null,
        colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000D",
      config: {},
    },
    // Blogs
    {
      id: "726F7453-5765-6265-5061-67650000000E",
      config: {
        header: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/07082023141810.png",
          title: "Blogs",
        },
        blogs: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "/images/default-theme/background-default-blog-theme-2.png",
        },
      },
    },
    // Blog detail
    {
      id: "726F7453-5765-6265-5061-67650000000F",
      config: {
        header: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/07082023141810.png",
          title: "Blogs",
        },
        blogs: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "/images/default-theme/background-default-blog-theme-2.png",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000H",
      config: {
        header: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/15112023142540.jpg",
          title: "Reservation",
          visible: true,
        },
        reservation: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          backgroundImage: null,
        },
      },
    },
  ],
};

export default defaultConfig;
