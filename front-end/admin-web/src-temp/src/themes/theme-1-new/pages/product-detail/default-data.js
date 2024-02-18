import { getPathByCurrentURL } from "../../../utils/helpers";
import similarProduct4 from "../../assets/images/ca_phe_dua.png";
import similarProduct1 from "../../assets/images/chanh_tuyet_vai_hoa_hong.png";
import similarProduct2 from "../../assets/images/matcha_socola.png";
import similarProduct3 from "../../assets/images/pho_mai_tuyet_hoa_hong.png";
import productDetail1 from "../../assets/images/product-detail-1.png";
import productDetail2 from "../../assets/images/product-detail-2.png";
import productDetail3 from "../../assets/images/product-detail-3.png";
const path = getPathByCurrentURL();
const navigateTo = path + "/product-detail/2232f8a2-fee2-4281-a302-eee8e866f97c";
export const dataProductDefault = {
  product: {
    productDetail: {
      id: "81df5204-82ca-49ba-8c99-f232dddd489d",
      productCategoryId: "db64859d-134a-4939-ac55-fd4469e81175",
      name: "Cà phê sữa",
      isHasPromotion: true,
      isPromotionProductCategory: false,
      isDiscountPercent: false,
      discountPrice: 15000,
      discountValue: 15000,
      description: "Cà phê sữa đặt biệt thơm ngon!!!!!",
      thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13022023175131.jpg",
      isTopping: false,
      productPrices: [
        {
          id: "4c2be408-a98f-4755-82dc-b82696244046",
          isApplyPromotion: true,
          priceName: "Size nhỏ",
          priceValue: 35000,
          originalPrice: 50000,
          createdTime: "2023-01-31T08:30:05.9599346",
        },
        {
          id: "058e7c02-7f8e-4cd7-b9d2-3fc79466fc2c",
          isApplyPromotion: true,
          priceName: "Size vừa",
          priceValue: 40000,
          originalPrice: 55000,
          createdTime: "2023-01-31T08:30:05.9599409",
        },
        {
          id: "b74f14d8-e8a5-4193-a8fb-30723d9bc96f",
          isApplyPromotion: true,
          priceName: "Size lớn",
          priceValue: 45000,
          originalPrice: 60000,
          createdTime: "2023-01-31T08:30:05.9599448",
        },
      ],
      productOptions: [
        {
          id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
          name: "Tuỳ chọn",
          optionLevels: [
            {
              id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
              name: "Nóng",
              isSetDefault: true,
              optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            },
            {
              id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
              name: "Đá",
              isSetDefault: false,
              optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            },
          ],
        },
        {
          id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
          name: "Mức đường",
          optionLevels: [
            {
              id: "cf82cce3-8468-486c-aa09-9b68b94680b4",
              name: "Bình thường",
              isSetDefault: true,
              optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
            },
            {
              id: "b77450f6-90be-4770-b669-3e74e76e9866",
              name: "Ít đường",
              isSetDefault: false,
              optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
            },
            {
              id: "439643c4-0cd2-41e0-8aab-c6b1ad4c2ea3",
              name: "Không đường",
              isSetDefault: false,
              optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
            },
          ],
        },
      ],
    },
    productToppings: [
      {
        toppingId: "2232f8a2-fee2-4281-a302-eee8e866f97c",
        name: "Bánh quy",
        priceValue: 10000,
        quantity: 0,
      },
      {
        toppingId: "d488c4b6-6464-4b20-83fe-3132c90e3377",
        name: "Bánh mì lát",
        priceValue: 10000,
        quantity: 0,
      },
    ],
  },
  similarProducts: [
    {
      id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
      name: "Chanh tuyết vải hoa hồng",
      sellingPrice: 35000,
      thumbnail: similarProduct1,
      navigateTo: navigateTo,
    },
    {
      id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
      name: "Mát cha socola",
      sellingPrice: 35000,
      thumbnail: similarProduct2,
      navigateTo: navigateTo,
    },
    {
      id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
      name: "Phô mai tuyết hoa hồng",
      sellingPrice: 35000,
      thumbnail: similarProduct3,
      navigateTo: navigateTo,
    },
    {
      id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
      name: "Dừa cà phê",
      sellingPrice: 35000,
      thumbnail: similarProduct4,
      navigateTo: navigateTo,
    },
    {
      id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
      name: "Dừa cà phê",
      sellingPrice: 35000,
      thumbnail: similarProduct4,
      navigateTo: navigateTo,
    },
  ],
};

export const productImagesDefault = [
  {
    imageUrl: productDetail1,
  },
  {
    imageUrl: productDetail2,
  },
  {
    imageUrl: productDetail3,
  },
];
export const similarProducts = [
  {
    name: "Chanh tuyết vải hoa hồng",
    price: 35000,
    image: similarProduct1,
  },
  {
    name: "Mát cha socola",
    price: 35000,
    image: similarProduct2,
  },
  {
    name: "Phô mai tuyết hoa hồng",
    price: 35000,
    image: similarProduct3,
  },
  {
    name: "Dừa cà phê",
    price: 35000,
    image: similarProduct4,
  },
  {
    name: "Dừa cà phê",
    price: 35000,
    image: similarProduct4,
  },
];
