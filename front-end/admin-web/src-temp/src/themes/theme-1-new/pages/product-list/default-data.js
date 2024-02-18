import { getPathByCurrentURL, randomGuid } from "../../../utils/helpers";
import ChanhTuyetVaiHoaHong from "../../assets/images/chanh_tuyet_vai_hoa_hong.png";
import MatchaDua from "../../assets/images/matcha_dua.png";
import PhoMaiTuyetHoaHong from "../../assets/images/pho_mai_tuyet_hoa_hong.png";
const path = getPathByCurrentURL();
const idCategory = {
  daXay: randomGuid(),
  caPhe: randomGuid(),
  suaChua: randomGuid(),
  tra: randomGuid(),
  smoothies: randomGuid(),
  traSua: randomGuid(),
  soDa: randomGuid(),
  nuocEp: randomGuid(),
  monDacBiet: randomGuid(),
};

export const allProductsWithCategoryDefault = [
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: true,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Chanh tuyết vải hoa hồng",
    productCategoryId: idCategory.daXay,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su",
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 50000,
        priceValue: 35000,
      },
    ],
    thumbnail: ChanhTuyetVaiHoaHong,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Mát cha socola",
    productCategoryId: idCategory.daXay,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: MatchaDua,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Phô mai tuyết hoa hồng",
    productCategoryId: idCategory.daXay,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: PhoMaiTuyetHoaHong,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: true,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Chanh tuyết vải hoa hồng",
    productCategoryId: idCategory.daXay,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 50000,
        priceValue: 35000,
      },
    ],
    thumbnail: ChanhTuyetVaiHoaHong,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: true,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Chanh tuyết vải hoa hồng",
    productCategoryId: idCategory.caPhe,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 50000,
        priceValue: 35000,
      },
    ],
    thumbnail: ChanhTuyetVaiHoaHong,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Mát cha socola",
    productCategoryId: idCategory.caPhe,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: MatchaDua,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Phô mai tuyết hoa hồng",
    productCategoryId: idCategory.caPhe,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: PhoMaiTuyetHoaHong,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: true,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Chanh tuyết vải hoa hồng",
    productCategoryId: idCategory.tra,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 50000,
        priceValue: 35000,
      },
    ],
    thumbnail: ChanhTuyetVaiHoaHong,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Mát cha socola",
    productCategoryId: idCategory.tra,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: MatchaDua,
  },
  {
    discountPrice: 0,
    id: randomGuid(),
    isDiscountPercent: false,
    isHasPromotion: false,
    isPromotionProductCategory: false,
    name: "Phô mai tuyết hoa hồng",
    productCategoryId: idCategory.tra,
    productPrices: [
      {
        id: "5762f529-9b14-470e-a425-1987bc52d5a4",
        isApplyPromotion: false,
        originalPrice: 0,
        priceValue: 35000,
      },
    ],
    thumbnail: PhoMaiTuyetHoaHong,
  },
];
export const productCategoriesDefault = [
  {
    id: idCategory.daXay,
    name: "Đá xay",
  },
  {
    id: idCategory.caPhe,
    name: "Cà phê",
  },
  {
    id: idCategory.suaChua,
    name: "Sữa chua",
  },
  {
    id: idCategory.tra,
    name: "Trà",
  },  
  {
    id: idCategory.smoothies,
    name: "Smoothies",
  },
  {
    id: idCategory.traSua,
    name: "Trà sữa",
  },
  {
    id: idCategory.soDa,
    name: "Soda",
  },
  {
    id: idCategory.nuocEp,
    name: "Nước ép",
  },
  {
    id: idCategory.monDacBiet,
    name: "Món đặc biệt",
  },
];

export const allCombosDefault = [
  {
    id: "955315b7-20b9-479c-add4-2ab7e0e1c017",
    name: "Combo 1",
    description: "",
    isShowAllBranches: true,
    thumbnail: ChanhTuyetVaiHoaHong,
    comboTypeId: 0,
    comboPriceTypeId: 0,
    sellingPrice: 11000,
    comboStoreBranches: [],
    comboProductPrices: [],
    comboProductGroups: [
      {
        id: "72cc6ddd-39be-4979-a3f4-a41b4f1a9678",
        productCategoryId: "c87dc2ad-0ee2-45dc-a1be-3a1f5f540e08",
        quantity: 0,
        comboProductGroupProductPrices: [
          {
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              priceValue: 10000,
              product: {
                id: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [],
              },
            },
          },
          {
            productPriceId: "1a2d132e-2540-4360-b21d-e8fa181b5927",
            productPrice: {
              productId: "2bef8e16-8ffb-4979-95e9-a2b4b4347d1a",
              priceValue: 12000,
              product: {
                id: "2bef8e16-8ffb-4979-95e9-a2b4b4347d1a",
                name: "Bánh cốm",
                productOptions: [],
              },
            },
          },
        ],
      },
      {
        id: "18ad792b-528f-4b2c-93df-e245728e0e43",
        productCategoryId: "21e32b59-c35a-4ac1-9e96-c8e64ac8a41b",
        quantity: 1,
        comboProductGroupProductPrices: [
          {
            productPriceId: "872fabcf-e506-481c-bfba-35f5cab075a9",
            productPrice: {
              productId: "aefcac44-bea9-4adc-b484-3e082eaeaba0",
              priceValue: 1000,
              product: {
                id: "aefcac44-bea9-4adc-b484-3e082eaeaba0",
                name: "Kem dừa",
                productOptions: [],
              },
            },
          },
          {
            productPriceId: "6b8d9483-db3a-422e-8cfd-e3a5ccdd45a4",
            productPrice: {
              productId: "3e620554-3bde-48a8-82ec-501a6d424cc1",
              priceName: "",
              priceValue: 12000,
              product: {
                id: "3e620554-3bde-48a8-82ec-501a6d424cc1",
                name: "Kem khoai môn",
                thumbnail: PhoMaiTuyetHoaHong,
                productOptions: [],
              },
            },
          },
          {
            productPriceId: "3795a659-4359-49ab-af9d-17a13617ae9c",
            productPrice: {
              productId: "2bc3d488-2d38-429b-a334-cdf3dee32ec4",
              priceValue: 30000,
              product: {
                id: "2bc3d488-2d38-429b-a334-cdf3dee32ec4",
                name: "Kem dừa",
                productOptions: [],
              },
            },
          },
        ],
      },
    ],
    comboPricings: [
      {
        id: "d008ee07-53f7-4138-8454-da80bca42aca",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Trà sữa | Sữa đậu nành",
        originalPrice: 11000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "af7ead20-ffb0-4029-8510-3a27ad33081d",
            comboPricingId: "d008ee07-53f7-4138-8454-da80bca42aca",
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            sellingPrice: 10000,
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 10000,
            },
          },
          {
            id: "4f98b72a-68cf-48ff-b083-5e56aa6826bb",
            comboPricingId: "d008ee07-53f7-4138-8454-da80bca42aca",
            productPriceId: "872fabcf-e506-481c-bfba-35f5cab075a9",
            sellingPrice: 1000,
            productPrice: {
              productId: "aefcac44-bea9-4adc-b484-3e082eaeaba0",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem dừa",
                productOptions: [],
              },
              priceValue: 1000,
            },
          },
        ],
      },
      {
        id: "f8c16441-70a5-4171-80db-ea4bfa2727c8",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Trà sữa | Kem khoai môn",
        originalPrice: 22000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "9129921c-790f-48f2-9740-51a719340866",
            comboPricingId: "f8c16441-70a5-4171-80db-ea4bfa2727c8",
            productPriceId: "6b8d9483-db3a-422e-8cfd-e3a5ccdd45a4",
            sellingPrice: 12000,
            productPrice: {
              productId: "3e620554-3bde-48a8-82ec-501a6d424cc1",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem khoai môn",
                thumbnail: PhoMaiTuyetHoaHong,
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceName: "",
              priceValue: 12000,
            },
          },
          {
            id: "e3f944d8-ecec-4755-9fd2-8d3091475f49",
            comboPricingId: "f8c16441-70a5-4171-80db-ea4bfa2727c8",
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            sellingPrice: 10000,
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 10000,
            },
          },
        ],
      },
      {
        id: "504d334a-4134-42c8-bdf6-e44aa6ad178a",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Trà sữa | Kem dừa",
        originalPrice: 40000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "7c11c86b-ed43-40ef-9871-b3c9fd1a72ac",
            comboPricingId: "504d334a-4134-42c8-bdf6-e44aa6ad178a",
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            sellingPrice: 10000,
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 10000,
            },
          },
          {
            id: "e589d785-49c7-4b9e-96cc-c806b9b84854",
            comboPricingId: "504d334a-4134-42c8-bdf6-e44aa6ad178a",
            productPriceId: "3795a659-4359-49ab-af9d-17a13617ae9c",
            sellingPrice: 30000,
            productPrice: {
              productId: "2bc3d488-2d38-429b-a334-cdf3dee32ec4",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem dừa",
                productOptions: [],
              },
              priceValue: 30000,
            },
          },
        ],
      },
      {
        id: "4a6ac971-ed65-4cd2-8d9e-94f884c1505f",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Bánh cốm | Kem dừa",
        originalPrice: 13000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "ff285622-cd17-4fd6-afa5-1bbe2df4e7cd",
            comboPricingId: "4a6ac971-ed65-4cd2-8d9e-94f884c1505f",
            productPriceId: "1a2d132e-2540-4360-b21d-e8fa181b5927",
            sellingPrice: 12000,
            productPrice: {
              productId: "2bef8e16-8ffb-4979-95e9-a2b4b4347d1a",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Bánh cốm",
                productOptions: [],
              },
              priceValue: 12000,
            },
          },
          {
            id: "7b0e619f-0931-4c30-948d-75d418007898",
            comboPricingId: "4a6ac971-ed65-4cd2-8d9e-94f884c1505f",
            productPriceId: "872fabcf-e506-481c-bfba-35f5cab075a9",
            sellingPrice: 1000,
            productPrice: {
              productId: "aefcac44-bea9-4adc-b484-3e082eaeaba0",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem dừa",
                productOptions: [],
              },
              priceValue: 1000,
            },
          },
        ],
      },
      {
        id: "c79c39e0-b3ac-4985-bb96-4f01fa383e4b",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Bánh cốm | Kem khoai môn",
        originalPrice: 24000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "f0d3e2d5-baa6-438c-8a4c-df6b8bca9e00",
            comboPricingId: "c79c39e0-b3ac-4985-bb96-4f01fa383e4b",
            productPriceId: "6b8d9483-db3a-422e-8cfd-e3a5ccdd45a4",
            sellingPrice: 12000,
            productPrice: {
              productId: "3e620554-3bde-48a8-82ec-501a6d424cc1",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem khoai môn",
                thumbnail: PhoMaiTuyetHoaHong,
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceName: "",
              priceValue: 12000,
            },
          },
          {
            id: "b5cfce20-4e97-45b5-a221-f7e9b9e60c2d",
            comboPricingId: "c79c39e0-b3ac-4985-bb96-4f01fa383e4b",
            productPriceId: "1a2d132e-2540-4360-b21d-e8fa181b5927",
            sellingPrice: 12000,
            productPrice: {
              productId: "2bef8e16-8ffb-4979-95e9-a2b4b4347d1a",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Bánh cốm",
                productOptions: [],
              },
              priceValue: 12000,
            },
          },
        ],
      },
      {
        id: "9714f383-20fa-47ab-b6ff-efc680200a46",
        comboId: "955315b7-20b9-479c-add4-2ab7e0e1c017",
        comboName: "Bánh cốm | Kem dừa",
        originalPrice: 42000,
        sellingPrice: 11000,
        comboPricingProducts: [
          {
            id: "7cffa8aa-0757-4b8a-8bfa-4940a7c14426",
            comboPricingId: "9714f383-20fa-47ab-b6ff-efc680200a46",
            productPriceId: "1a2d132e-2540-4360-b21d-e8fa181b5927",
            sellingPrice: 12000,
            productPrice: {
              productId: "2bef8e16-8ffb-4979-95e9-a2b4b4347d1a",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Bánh cốm",
                productOptions: [],
              },
              priceValue: 12000,
            },
          },
          {
            id: "5cfb0279-cbeb-439a-bd4d-985132c44eca",
            comboPricingId: "9714f383-20fa-47ab-b6ff-efc680200a46",
            productPriceId: "3795a659-4359-49ab-af9d-17a13617ae9c",
            sellingPrice: 30000,
            productPrice: {
              productId: "2bc3d488-2d38-429b-a334-cdf3dee32ec4",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Kem dừa",
                productOptions: [],
              },
              priceValue: 30000,
            },
          },
        ],
      },
    ],
    comboId: "00000000-0000-0000-0000-000000000000",
    originalPrice: 11000,
    comboPricingId: "00000000-0000-0000-0000-000000000000",
  },
  {
    id: "f155eb25-3fe0-4688-8ce1-7487d4b59cc5",
    name: "Combo 2",
    thumbnail: ChanhTuyetVaiHoaHong,
    description: "",
    isShowAllBranches: true,
    comboTypeId: 0,
    comboPriceTypeId: 0,
    sellingPrice: 29000,
    comboStoreBranches: [],
    comboProductPrices: [],
    comboProductGroups: [
      {
        id: "def2a744-1791-435a-8e2d-bb57a0c1921b",
        productCategoryId: "c87dc2ad-0ee2-45dc-a1be-3a1f5f540e08",
        quantity: 0,
        comboProductGroupProductPrices: [
          {
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              priceValue: 10000,
              product: {
                id: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [],
              },
            },
          },
        ],
      },
      {
        id: "8fad7788-8280-46fa-b34d-7effeecd3d49",
        productCategoryId: "c7222b18-209e-4781-98e3-7fec00052d4e",
        quantity: 1,
        comboProductGroupProductPrices: [
          {
            productPriceId: "a656743b-73b8-495c-b4ab-05e16d1eb913",
            productPrice: {
              productId: "6d46d954-d701-47a5-b031-382c5dcd0a8b",
              priceValue: 12000,
              product: {
                id: "6d46d954-d701-47a5-b031-382c5dcd0a8b",
                name: "Bánh chuối nướng",
                thumbnail: PhoMaiTuyetHoaHong,
                productOptions: [],
              },
            },
          },
          {
            productPriceId: "ad6687e9-9264-4b9f-ade0-398e44bf4d45",
            productPrice: {
              productId: "e64a6f0c-2448-4ed4-b009-f29c63d17c4a",
              priceValue: 19000,
              product: {
                id: "e64a6f0c-2448-4ed4-b009-f29c63d17c4a",
                name: "Matcha",
                thumbnail: MatchaDua,
                productOptions: [],
              },
            },
          },
        ],
      },
    ],
    comboPricings: [
      {
        id: "14bdfa84-1eff-4820-aee3-d58a7a19fa85",
        comboId: "f155eb25-3fe0-4688-8ce1-7487d4b59cc5",
        comboName: "Trà sữa | Bánh chuối nướng",
        originalPrice: 22000,
        sellingPrice: 29000,
        comboPricingProducts: [
          {
            id: "ee8f6bf6-32fb-499b-8354-93fcff5adf54",
            comboPricingId: "14bdfa84-1eff-4820-aee3-d58a7a19fa85",
            productPriceId: "a656743b-73b8-495c-b4ab-05e16d1eb913",
            sellingPrice: 12000,
            productPrice: {
              productId: "6d46d954-d701-47a5-b031-382c5dcd0a8b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Bánh chuối nướng",
                thumbnail: MatchaDua,
                productOptions: [
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 12000,
            },
          },
          {
            id: "5eecb5cc-77b9-430f-be03-a441a1e2a774",
            comboPricingId: "14bdfa84-1eff-4820-aee3-d58a7a19fa85",
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            sellingPrice: 10000,
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 10000,
            },
          },
        ],
      },
      {
        id: "1de3b4cb-440d-4bbd-bb09-c21e977e9a41",
        comboId: "f155eb25-3fe0-4688-8ce1-7487d4b59cc5",
        comboName: "Trà sữa | Cafe",
        originalPrice: 29000,
        sellingPrice: 29000,
        comboPricingProducts: [
          {
            id: "f7fd9df8-9d2c-458b-b5de-0078dfa183a3",
            comboPricingId: "1de3b4cb-440d-4bbd-bb09-c21e977e9a41",
            productPriceId: "2643e13a-a287-41b9-8bdb-5a510c20a5e8",
            sellingPrice: 10000,
            productPrice: {
              productId: "21104b3a-587b-4f09-b1db-5aae6fe7a89b",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Trà sữa",
                thumbnail: "",
                productOptions: [
                  {
                    optionId: "0a99d514-9c16-498e-9ad5-c688df4230d5",
                    optionLevelId: "a5224bc9-436c-4183-b66e-de2b6112947e",
                    optionName: "Tô",
                    optionLevelName: "Vừa",
                    isSetDefault: false,
                  },
                  {
                    optionId: "c0cef789-be88-4e95-b023-abee2b453069",
                    optionLevelId: "d6414f8d-288e-43d6-a716-bf4d4cd1b6f5",
                    optionName: "Đá",
                    optionLevelName: "Nhiều",
                    isSetDefault: false,
                  },
                ],
              },
              priceValue: 10000,
            },
          },
          {
            id: "98d3c09d-1e91-4ac7-ad8d-a31b3867d877",
            comboPricingId: "1de3b4cb-440d-4bbd-bb09-c21e977e9a41",
            productPriceId: "ad6687e9-9264-4b9f-ade0-398e44bf4d45",
            sellingPrice: 19000,
            productPrice: {
              productId: "e64a6f0c-2448-4ed4-b009-f29c63d17c4a",
              product: {
                productId: "00000000-0000-0000-0000-000000000000",
                name: "Matcha",
                thumbnail: MatchaDua,
                productOptions: [],
              },
              priceValue: 19000,
            },
          },
        ],
      },
    ],
    comboId: "00000000-0000-0000-0000-000000000000",
    originalPrice: 22000,
    comboPricingId: "00000000-0000-0000-0000-000000000000",
  },
];
