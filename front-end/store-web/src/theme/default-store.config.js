import { Hyperlink } from "./constants/hyperlink.constants";

const { default: PageType } = require("./constants/page-type.constants");

const defaultConfig = {
  themeId: "921016FE-D34E-4192-BEB8-15D775D0EE5B",
  storeThemeId: null,
  currencyCode: "VND",
  currencySymbol: "đ",
  general: {
    generalBackground: {
      backgroundType: 1,
      backgroundColor: "rgba(255,255,255,1)",
      backgroundImage: "/images/default-theme/background-default.png",
    },
    color: {
      colorGroups: [
        {
          id: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          name: "Color Group Default",
          titleColor: "rgba(2,111,48,1)",
          textColor: "rgba(0,0,0,1)",
          buttonBackgroundColor: "rgba(247,147,30,1)",
          buttonTextColor: "rgba(255,255,255,1)",
          buttonBorderColor: "transparent",
          isDefault: true,
        },
      ],
    },
    header: {
      backgroundType: 1,
      backgroundColor: "rgba(255,255,255,1)",
      backgroundImage: null,
      colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
      logoUrl: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/12122022094741.png",
      menuId: null,
      menuItems: [
        {
          url: "/about-us",
          name: "home.aboutUs",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/product-list",
          name: "home.product",
          hyperlinkOption: Hyperlink.PRODUCTS,
        },
        {
          url: "#",
          name: "home.promotion",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "/",
          name: "home.store",
          hyperlinkOption: Hyperlink.URL,
        },
        {
          url: "#",
          name: "home.recruitment",
          hyperlinkOption: Hyperlink.URL,
        },
      ],
    },
    footer: {
      generalCustomization: {
        backgroundType: 2,
        backgroundColor: "rgba(255,255,255,1)",
        backgroundImage: "/images/default-theme/theme1-background-default-footer.png",
        colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
      },
      logo: {
        visible: true,
        logoUrl: null,
      },
      storeInformation: {
        headOffice: "Công ty Cổ Phần Nguyễn Gia - ĐKKD: 0316 871719 do sở KHĐT TPHCM cấp lần đầu ngày 21/05/2021",
        phoneNumber: "028 6263 0377 - 6263 0378",
        email: "sales@phuclong.masangroup.com",
        email1: "info2@phuclong.masangroup.com",
        storeName: null,
        address: "42/24 - 42/26 Đường 643 Tạ Quang Bửu, phường 4, quận 8, Hồ Chí Minh",
        hotline: null,
        showAllBranch: true,
        visible: true,
      },
      menu: {
        menuTitle: "Giới thiệu",
        menuId: null,
        menuItems: [
          {
            url: "#",
            name: "Trang chủ",
          },
          {
            url: "#",
            name: "Thực đơn",
          },
          {
            url: "#",
            name: "Giới thiệu",
          },
          {
            url: "#",
            name: "Blog - Bài viết",
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
        menuPolicyId: null,
        visible: true,
      },
      downloadApp: {
        qrCode: false,
        title: "",
        qrCodeImage: null,
        appStore: false,
        appStoreLink: "",
        googlePlay: false,
        googlePlayLink: "",
        visible: true,
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
        copyRightText: "Copyright © 2022 Tropical",
        visible: true,
      },
    },
    favicon: "/images/default-theme/favicon-default.ico",
    appLogo: "",
    font: {
      name: "Plus Jakarta Sans",
      path: "https://fonts.googleapis.com/css?family=Plus+Jakarta+Sans"
    }
  },
  pages: [
    {
      id: "726F7453-5765-6265-5061-676500000001",
      config: {
        slideShow: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          slideBanner: [
            {
              url: "javascript:void()",
              href: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/12122022101610.jpg",
            },
            {
              url: "javascript:void()",
              href: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/12122022101629.jpg",
            },
            {
              url: "javascript:void()",
              href: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/12122022101645.png",
            },
          ],
          visible: true,
        },
        category: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          categoryList: [
            {
              thumbnail: "/images/default-theme/ca-phe-cate-theme1.png",
              title: "Cà phê",
              description: "Hương vị cà phê chồn thơm ngất ngây người thưởng thức",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              thumbnail: "/images/default-theme/sinh-to-cate-theme1.png",
              title: "Sinh tố",
              description: "Hương vị sinh tố béo béo hấp dẫn",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              thumbnail: "/images/default-theme/da-bao-cate-theme1.png",
              title: "Đá bào",
              description: "Món ăn vặt quen thuộc cho ngày hè nóng bức",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              thumbnail: "/images/default-theme/nuoc-ep-cate-theme1.png",
              title: "Nước ép",
              description: "Tăng sức đề kháng cho cơ thể, thanh lọc, giàu chất chống oxi hóa",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              thumbnail: "/images/default-theme/sua-chua-cate-theme1.png",
              title: "Sữa chua",
              description: "Được lên men tự nhiên, rất tốt cho cơ thể",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
            {
              thumbnail: "/images/default-theme/da-chanh-cate-theme1.png",
              title: "Đá chanh",
              description: "Bổ sung vitamin C, tăng sức đề kháng",
              buttonText: "Đặt ngay",
              hyperlinkType: 6,
              hyperlinkValue: "#",
            },
          ],
          visible: true,
        },
        bestSellingProduct: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          title: "Chỉ dành riêng cho bạn",
          isCheckAllProduct: false,
          bestSellingProductIds: [],
          visible: true,
        },
        signatureProduct: {
          generalCustomization: {
            backgroundType: 2,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: "/images/default-theme/bg-default-signature-product.png",
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          signatureProducts: [
            {
              nameCategory: "Cà Phê 1",
              textArea: "Lorem Ipsum is simpetting industry. Lorem Iy's standard due",
              buttonText: "Thử ngay",
              hyperlink: "/images/default-theme/signature-product.png",
              thumbnail: "/images/default-theme/signature-product.png",
            },
            {
              nameCategory: "Cà Phê 2",
              textArea: "Lorem Ipsum is simpetting industry. Lorem Iy's standard due",
              buttonText: "Thử ngay",
              hyperlink: "/images/default-theme/signature-product-2.png",
              thumbnail: "/images/default-theme/signature-product-2.png",
            },
          ],
          visible: true,
        },
        booking: {},
        blogs: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(233,233,233,1)",
            backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14082023164616.png",
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          visible: true,
        },
        branches: {},
        todayMenu: {},
        banner: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: null,
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          visible: true,
          bannerList: [
            {
              imageUrl: "/images/default-theme/theme1-banner-default-first.png",
              hyperlinkType: null,
              hyperlinkValue: null,
            },
            {
              imageUrl: "/images/default-theme/theme1-banner-default-second.png",
              hyperlinkType: null,
              hyperlinkValue: null,
            },
            {
              imageUrl: "/images/default-theme/theme1-banner-default-thirst.png",
              hyperlinkType: null,
              hyperlinkValue: null,
            },
          ],
        },
        advertisement: {},
        introduction: {},
        flashSale: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundImage: null,
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          visible: true,
        },
        promotionSection: {
          generalCustomization: {
            backgroundType: 1,
            backgroundTypeDiscountSection: 2,
            backgroundColor: "rgba(255,255,255,1)",
            backgroundColorDiscountSection: "rgba(255,255,255,1)",
            backgroundImageDiscountSection: "/images/default-theme/background-discount-logo.png",
            backgroundImage: null,
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          visible: true,
        },
        reservation: {
          generalCustomization: {
            backgroundType: 1,
            backgroundColor: "rgba(233,233,233,1)",
            backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/14082023164616.png",
            colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          },
          visible: true,
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000002",
      config: {
        header: {
          title: "Sản phẩm",
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-stag/stagimages/28102023103311.png",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
        },
        productsProductList: {
          backgroundType: 1,
          backgroundColor: "rgb(249, 249, 247)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000003",
      config: {
        backgroundType: 1,
        backgroundColor: "rgba(255, 255, 255, 1)",
        backgroundImage: null,
        colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000004",
      config: {},
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
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          title: "Checkout Order",
          visible: true,
        },
        checkout: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/04052023103913.jpg",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-676500000008",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-676500000009",
      config: {
        backgroundType: 1,
        backgroundColor: "rgba(255,255,255,1)",
        backgroundImage: "/images/default-theme/1/background-register-default.png",
        colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
        title: "Đăng nhập",
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000A",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-67650000000B",
      config: {
        backgroundType: 1,
        backgroundColor: "rgba(255,255,255,1)",
        backgroundImage: null,
        colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000C",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-67650000000D",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-67650000000E",
      config: {
        header: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          title: "Blog",
          visible: true,
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/12092023165109.png",
        },
        blogList: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/08082023152111.jpg",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000F",
      config: {
        header: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/08082023153112.png",
        },
        article: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: "https://s3-sgn09.fptcloud.com/gofnb-qa/devimages/08082023142404.jpg",
        },
      },
    },
    {
      id: "726F7453-5765-6265-5061-67650000000G",
      config: {},
    },
    {
      id: "726F7453-5765-6265-5061-67650000000H",
      config: {
        header: {
          backgroundType: 2,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: "/images/default-theme/1/reserve-table-background-default.png",
          title: "Reservation",
          visible: true,
        },
        reservation: {
          backgroundType: 1,
          backgroundColor: "rgba(255,255,255,1)",
          colorGroupId: "6032CC80-CBF2-4EF4-8BC2-5B43E3F02009",
          backgroundImage: null,
        },
      },
    },
  ],
};

export default defaultConfig;
