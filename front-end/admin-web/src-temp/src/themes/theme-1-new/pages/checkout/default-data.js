import ahamoveIcon from "../../assets/icons/ahamove.svg";
import cashIcon from "../../assets/icons/cash.svg";
import codIcon from "../../assets/icons/cod.svg";
import grabExpressIcon from "../../assets/icons/icon-grab-express.svg";
import momoIcon from "../../assets/icons/momo.svg";
import shippingIcon from "../../assets/icons/shipping.svg";
import visaIcon from "../../assets/icons/visa-master-card.svg";
import bankIcon from "../../assets/images/payment-default-logo.png";
import vnPayIcon from "../../assets/images/vnpay-logo.png";
import zaloIcon from "../../assets/images/zalo-pay-logo.png";

export const shippingIcons = [
  { enumId: 1, icon: shippingIcon },
  { enumId: 2, icon: ahamoveIcon },
  { enumId: 4, icon: grabExpressIcon },
];

export const paymentIcons = [
  { enumId: 0, icon: momoIcon },
  { enumId: 1, icon: zaloIcon },
  { enumId: 2, icon: visaIcon },
  { enumId: 3, icon: cashIcon },
  { enumId: 4, icon: vnPayIcon },
  { enumId: 5, icon: codIcon },
  { enumId: 6, icon: bankIcon },
];

export const dataCheckoutShoppingCartDefault = [
  {
    isCombo: false,
    id: "6D46D954-D701-47A5-B031-382C5DCD0A8B",
    name: "Matcha",
    thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/03012023131132.jpeg",
    message: "",
    productPrice: {
      id: "A656743B-73B8-495C-B4AB-05E16D1EB913",
      isApplyPromotion: true,
      priceName: "S",
      priceValue: 12000,
      originalPrice: 15000,
      createdTime: "2023-01-31T08:30:05.9599346",
    },
    quantity: 1,
    options: [
      {
        id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
        name: "Sữa tươi",
        isSetDefault: true,
        optionLevelId: "c6438e14-4142-4a49-9595-64cfb8201e8d",
        optionLevelName: "Vừa",
      },
      {
        id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
        name: "Sữa đặc",
        isSetDefault: true,
        optionLevelId: "cf82cce3-8468-486c-aa09-9b68b94680b4",
        optionLevelName: "Vừa",
      },
    ],
    toppings: [
      {
        id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
        name: "Bánh lăn",
        priceValue: 8000,
        quantity: 0,
      },
      {
        id: "d488c4b6-6464-4b20-83fe-3132c90e3377",
        name: "Ca cao viên",
        priceValue: 5000,
        quantity: 0,
      },
    ],
    dataDetails: {
      product: {
        productDetail: {
          id: "81df5204-82ca-49ba-8c99-f232dddd489d",
          productCategoryId: "db64859d-134a-4939-ac55-fd4469e81175",
          name: "Cà phê sữa",
          isHasPromotion: true,
          isPromotionProductCategory: false,
          isDiscountPercent: false,
          discountValue: 5000,
          discountPrice: 5000,
          description: "Cà phê sữa đặt biệt thơm ngon!!!!!",
          thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13022023175131.jpg",
          isTopping: false,
          productPrices: [
            {
              id: "4c2be408-a98f-4755-82dc-b82696244046",
              isApplyPromotion: true,
              priceName: "S",
              priceValue: 24000,
              originalPrice: 29000,
              createdTime: "2023-01-31T08:30:05.9599346",
            },
            {
              id: "058e7c02-7f8e-4cd7-b9d2-3fc79466fc2c",
              isApplyPromotion: true,
              priceName: "M",
              priceValue: 30000,
              originalPrice: 35000,
              createdTime: "2023-01-31T08:30:05.9599409",
            },
            {
              id: "b74f14d8-e8a5-4193-a8fb-30723d9bc96f",
              isApplyPromotion: true,
              priceName: "L",
              priceValue: 44000,
              originalPrice: 49000,
              createdTime: "2023-01-31T08:30:05.9599448",
            },
          ],
          productOptions: [
            {
              id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
              name: "Sữa tươi",
              optionLevels: [
                {
                  id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
                  name: "Vừa",
                  isSetDefault: true,
                  optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  optionName: "Sữa tươi",
                },
                {
                  id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
                  name: "Nhiều",
                  isSetDefault: false,
                  optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  optionName: "Sữa tươi",
                },
                {
                  id: "1c384b83-262d-4f24-afc3-450978f4fec0",
                  name: "Ít",
                  isSetDefault: false,
                  optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  optionName: "Sữa tươi",
                },
              ],
            },
            {
              id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
              name: "Sữa đặc",
              optionLevels: [
                {
                  id: "cf82cce3-8468-486c-aa09-9b68b94680b4",
                  name: "Vừa",
                  isSetDefault: true,
                  optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                  optionName: "Sữa đặc",
                },
                {
                  id: "b77450f6-90be-4770-b669-3e74e76e9866",
                  name: "Nhiều",
                  isSetDefault: false,
                  optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                  optionName: "Sữa đặc",
                },
                {
                  id: "439643c4-0cd2-41e0-8aab-c6b1ad4c2ea3",
                  name: "Ít",
                  isSetDefault: false,
                  optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                  optionName: "Sữa đặc",
                },
              ],
            },
          ],
        },
        productToppings: [
          {
            toppingId: "2232f8a2-fee2-4281-a302-eee8e866f97c",
            name: "Bánh lăn",
            priceValue: 8000,
            quantity: 0,
          },
          {
            toppingId: "d488c4b6-6464-4b20-83fe-3132c90e3377",
            name: "Ca cao viên",
            priceValue: 5000,
            quantity: 0,
          },
        ],
      },
    },
  },
  {
    isCombo: true,
    id: "0da52eee-f395-46d0-87bd-abf8b2ce4cfc",
    name: "Ca cao sữa tươi | Cà phê sữa (L)",
    comboPricingId: "8cdf9d65-912d-4384-ab2e-f764d459f2f1",
    comboPricingName: "Ca cao sữa tươi | Cà phê sữa (L)",
    thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094619.jpg",
    message: "",
    comboTypeId: 0,
    products: [
      {
        id: "2f98d247-2454-4555-a94a-a510bd013a79",
        name: "Ca cao sữa tươi",
        thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094514.jpg",
        productPrice: {
          id: "d17995d7-40a0-43d6-9ffb-9b48a1798bbe",
          priceValue: 30000,
        },
        options: [
          {
            id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            name: "Sữa tươi",
            isSetDefault: true,
            optionLevelId: "c6438e14-4142-4a49-9595-64cfb8201e8d",
            optionLevelName: "Vừa",
          },
        ],
        toppings: [],
      },
      {
        id: "81df5204-82ca-49ba-8c99-f232dddd489d",
        name: "Cà phê sữa",
        thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13022023175131.jpg",
        productPrice: {
          id: "b74f14d8-e8a5-4193-a8fb-30723d9bc96f",
          priceName: "L",
          priceValue: 49000,
        },
        options: [
          {
            id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            name: "Sữa tươi",
            isSetDefault: true,
            optionLevelId: "c6438e14-4142-4a49-9595-64cfb8201e8d",
            optionLevelName: "Vừa",
          },
          {
            id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
            name: "Sữa đặc",
            isSetDefault: true,
            optionLevelId: "cf82cce3-8468-486c-aa09-9b68b94680b4",
            optionLevelName: "Vừa",
          },
        ],
        toppings: [
          {
            id: "d488c4b6-6464-4b20-83fe-3132c90e3377",
            name: "Ca cao viên",
            priceValue: 5000,
            quantity: 0,
          },
          {
            id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
            name: "Bánh lăn",
            priceValue: 8000,
            quantity: 0,
          },
        ],
      },
    ],
    quantity: 2,
    originalPrice: 79000,
    sellingPrice: 70000,
    dataDetails: {
      comboId: "0da52eee-f395-46d0-87bd-abf8b2ce4cfc",
      comboPricingId: "8cdf9d65-912d-4384-ab2e-f764d459f2f1",
      comboPricingName: "Ca cao sữa tươi | Cà phê sữa (L)",
      name: "Ca cao sữa tươi | Cà phê sữa (L)",
      thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094619.jpg",
      description: "Combo nước thơm ngon!!",
      isCombo: true,
      comboTypeId: 0,
      originalPrice: 79000,
      sellingPrice: 79000,
      comboProductPrices: [
        {
          productPriceId: "d17995d7-40a0-43d6-9ffb-9b48a1798bbe",
          productPrice: {
            productId: "2f98d247-2454-4555-a94a-a510bd013a79",
            priceValue: 30000,
            product: {
              productId: "00000000-0000-0000-0000-000000000000",
              name: "Ca cao sữa tươi",
              thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094514.jpg",
              productOptions: [
                {
                  id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  name: "Sữa tươi",
                  optionLevels: [
                    {
                      id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "1c384b83-262d-4f24-afc3-450978f4fec0",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                  ],
                },
              ],
              productToppings: [],
            },
          },
          priceValue: 30000,
        },
        {
          productPriceId: "b74f14d8-e8a5-4193-a8fb-30723d9bc96f",
          productPrice: {
            productId: "81df5204-82ca-49ba-8c99-f232dddd489d",
            priceName: "L",
            priceValue: 49000,
            product: {
              productId: "00000000-0000-0000-0000-000000000000",
              name: "Cà phê sữa",
              thumbnail: "https://s3-sgn09.fptcloud.com/gofnb-dev/devimages/13022023175131.jpg",
              productOptions: [
                {
                  id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  name: "Sữa tươi",
                  optionLevels: [
                    {
                      id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "1c384b83-262d-4f24-afc3-450978f4fec0",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                  ],
                },
                {
                  id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                  name: "Sữa đặc",
                  optionLevels: [
                    {
                      id: "b77450f6-90be-4770-b669-3e74e76e9866",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                    {
                      id: "cf82cce3-8468-486c-aa09-9b68b94680b4",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                    {
                      id: "439643c4-0cd2-41e0-8aab-c6b1ad4c2ea3",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                  ],
                },
              ],
              productToppings: [
                {
                  toppingId: "d488c4b6-6464-4b20-83fe-3132c90e3377",
                  name: "Ca cao viên",
                  priceValue: 5000,
                  quantity: 0,
                },
                {
                  toppingId: "2232f8a2-fee2-4281-a302-eee8e866f97c",
                  name: "Bánh lăn",
                  priceValue: 8000,
                  quantity: 0,
                },
              ],
            },
          },
          priceValue: 49000,
          priceName: "L",
        },
      ],
    },
  },
  {
    isCombo: true,
    id: "24814b34-6122-4dbf-aa74-020b1fe4c957",
    name: "2 ly ca cao sữa đặc và sữa tươi",
    thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094619.jpg",
    message: "",
    comboTypeId: 1,
    products: [
      {
        id: "2f98d247-2454-4555-a94a-a510bd013a79",
        name: "Ca cao sữa tươi",
        thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094514.jpg",
        productPrice: {
          id: "d17995d7-40a0-43d6-9ffb-9b48a1798bbe",
          priceValue: 30000,
        },
        options: [
          {
            id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            name: "Sữa tươi",
            isSetDefault: true,
            optionLevelId: "c6438e14-4142-4a49-9595-64cfb8201e8d",
            optionLevelName: "Vừa",
          },
        ],
        toppings: [],
      },
      {
        id: "f091464a-9e4f-4e8b-8d6e-d4a413c9fa16",
        name: "Ca cao sữa đặc",
        thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094435.jpg",
        productPrice: {
          id: "4f0943dc-717a-4910-8196-1a5aafef1b69",
          priceValue: 25000,
        },
        options: [
          {
            id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
            name: "Sữa đặc",
            isSetDefault: true,
            optionLevelId: "cf82cce3-8468-486c-aa09-9b68b94680b4",
            optionLevelName: "Vừa",
          },
          {
            id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
            name: "Sữa tươi",
            isSetDefault: true,
            optionLevelId: "c6438e14-4142-4a49-9595-64cfb8201e8d",
            optionLevelName: "Vừa",
          },
        ],
        toppings: [
          {
            id: "d488c4b6-6464-4b20-83fe-3132c90e3377",
            name: "Ca cao viên",
            priceValue: 5000,
            quantity: 0,
          },
          {
            id: "2232f8a2-fee2-4281-a302-eee8e866f97c",
            name: "Bánh lăn",
            priceValue: 8000,
            quantity: 0,
          },
        ],
      },
    ],
    quantity: 3,
    originalPrice: 55000,
    sellingPrice: 45000,
    dataDetails: {
      id: "24814b34-6122-4dbf-aa74-020b1fe4c957",
      name: "2 ly ca cao sữa đặc và sữa tươi",
      description: "",
      thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094619.jpg",
      isCombo: true,
      comboTypeId: 1,
      sellingPrice: 45000,
      comboProductPrices: [
        {
          productPriceId: "d17995d7-40a0-43d6-9ffb-9b48a1798bbe",
          productPrice: {
            productId: "2f98d247-2454-4555-a94a-a510bd013a79",
            priceValue: 30000,
            product: {
              productId: "00000000-0000-0000-0000-000000000000",
              name: "Ca cao sữa tươi",
              thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094514.jpg",
              productOptions: [
                {
                  id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  name: "Sữa tươi",
                  optionLevels: [
                    {
                      id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "1c384b83-262d-4f24-afc3-450978f4fec0",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                  ],
                },
              ],
              productToppings: [],
            },
          },
          priceValue: 30000,
        },
        {
          productPriceId: "4f0943dc-717a-4910-8196-1a5aafef1b69",
          productPrice: {
            productId: "f091464a-9e4f-4e8b-8d6e-d4a413c9fa16",
            priceValue: 25000,
            product: {
              productId: "00000000-0000-0000-0000-000000000000",
              name: "Ca cao sữa đặc",
              thumbnail: "https://qagofnbsac.blob.core.windows.net/qaimages/31012023094435.jpg",
              productOptions: [
                {
                  id: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                  name: "Sữa đặc",
                  optionLevels: [
                    {
                      id: "b77450f6-90be-4770-b669-3e74e76e9866",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                    {
                      id: "cf82cce3-8468-486c-aa09-9b68b94680b4",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                    {
                      id: "439643c4-0cd2-41e0-8aab-c6b1ad4c2ea3",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "b7f92eb4-0857-4a12-aeaf-c73bda24266f",
                      optionName: "Sữa đặc",
                    },
                  ],
                },
                {
                  id: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                  name: "Sữa tươi",
                  optionLevels: [
                    {
                      id: "751ed1ee-3e6c-4f94-a453-06570109c4b0",
                      name: "Nhiều",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "1c384b83-262d-4f24-afc3-450978f4fec0",
                      name: "Ít",
                      isSetDefault: false,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                    {
                      id: "c6438e14-4142-4a49-9595-64cfb8201e8d",
                      name: "Vừa",
                      isSetDefault: true,
                      optionId: "aa4d3e0c-cf8b-49c7-be6c-5cbbad5481cb",
                      optionName: "Sữa tươi",
                    },
                  ],
                },
              ],
              productToppings: [
                {
                  toppingId: "d488c4b6-6464-4b20-83fe-3132c90e3377",
                  name: "Ca cao viên",
                  priceValue: 5000,
                  quantity: 0,
                },
                {
                  toppingId: "2232f8a2-fee2-4281-a302-eee8e866f97c",
                  name: "Bánh lăn",
                  priceValue: 8000,
                  quantity: 0,
                },
              ],
            },
          },
          priceValue: 25000,
        },
      ],
    },
  },
];
//Use mockup data for customize & preview checkout only
export const mockupTaxes = [
  { name: "VAT 5%", value: 9000 },
  { name: "VAT 8%", value: 22000 },
  { name: "VAT 10%", value: 39000 },
];
//Use mockup data for customize & preview checkout only
export const mockupDiscounts = [
  { promotionName: "Giảm giá trong ngày", totalDiscountAmount: 9000 },
  { promotionName: "Khuyến mãi đặc biệt", totalDiscountAmount: 22000 },
];

export const mockupCheckout = {
  name: "Nguyễn Văn A",
  phone: "0901234567",
  deliveryAddress: {
    receiverAddress: {
      id: "5372b8a6-8cda-4912-b656-d16742c86d24",
      name: "Home",
      address: "123 Đường Trần Quang Khải, Tân Định, Quận 1, Thành phố Hồ Chí Minh",
      customerAddressTypeId: 0,
      lat: 10.7918789,
      lng: 106.6921262,
      addressDetail: "Nhà",
      note: "Nhà",
    },
    branchAddress: {
      id: "c755f3b6-0807-48bc-bbcd-20eaff469dad",
      title: "Quang Trung",
      addressDetail: "656 Quang Trung, 11, Gò Vấp, Hồ Chí Minh",
      distance: "15,0 km",
      lat: 10.836209,
      lng: 106.6598915,
    },
  },
  deliveryMethods: [
    {
      deliveryMethodId: "4eeb36bd-d0e6-4ef2-a89e-a0057e8540cb",
      enumDeliveryMethod: 1,
      deliveryMethodName: "Delivery by shop",
      pricing: 10000,
    },
    {
      deliveryMethodId: "be8dac49-96a5-482e-a49b-6bf1a223156f",
      enumDeliveryMethod: 2,
      deliveryMethodName: "AhaMove",
      pricing: 42000,
    },
  ],
  paymentMethods: [
    {
      paymentMethodEnumId: 3,
      paymentMethodName: "Cash",
      icon: "assets/images/payment-cash-logo.png",
      paymentMethodId: "37ea8d80-d9b2-4208-85bb-8473cf771422",
      isDeleted: false,
    },
    {
      paymentMethodEnumId: 0,
      paymentMethodName: "MoMo",
      icon: "assets/images/logo-momo.png",
      paymentMethodId: "b26d46a4-c3ab-4182-be94-81bf5c7554e5",
      isDeleted: false,
    },
  ],
};
