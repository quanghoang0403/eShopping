import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import MasterTheme1 from "themes/theme-1/original.theme";
import BackgroundHeader from "../../../assets/images/background-header.png";
import ChanhTuyetVaiHoaHong from "../../../assets/images/chanh_tuyet_vai_hoa_hong.png";
import MatchaDua from "../../../assets/images/matcha_dua.png";
import PhoMaiTuyetHoaHong from "../../../assets/images/pho_mai_tuyet_hoa_hong.png";
import "../../../original.theme.scss";
import { randomGuid } from "../../../utils/helpers";
import { Theme1ProductList } from "./product-list.component";

export default function ProductListPreviewPageTheme1() {
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
  const storeThemeHeaderDefault = {
    buttonBackgroundColor: "#DB4D29",
    buttonBorderColor: "#8f4141",
    buttonTextColor: "#026F30",
    id: "332c77be-1174-4859-8187-f01e0c40cb59",
    isDefault: true,
    name: "Color Group Default",
    titleColor: "#026f30",
  };
  const storeThemeDataProductDefault = {
    buttonBackgroundColor: "#F7931E",
    buttonBorderColor: "#F7931E",
    buttonTextColor: "#FFF",
    id: "332c77be-1174-4859-8187-f01e0c40cb59",
    isDefault: true,
    name: "Color Group Default",
    titleColor: "#026f30",
  };
  const allProductsWithCategoryDefault = [
    {
      productCategoryId: idCategory.daXay,
      productCategoryName: "Đá xay",
      productsWithCategory: [
        {
          discountPrice: 0,
          id: randomGuid(),
          isDiscountPercent: false,
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
      ],
    },
    {
      productCategoryId: idCategory.caPhe,
      productCategoryName: "Cà phê",
      productsWithCategory: [
        {
          discountPrice: 0,
          id: randomGuid(),
          isDiscountPercent: false,
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
      ],
    },
    {
      productCategoryId: idCategory.tra,
      productCategoryName: "Trà",
      productsWithCategory: [
        {
          discountPrice: 0,
          id: randomGuid(),
          isDiscountPercent: false,
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
      ],
    },
  ];
  const productCategoriesDefault = [
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
  const newStoreThemeDataDefault = {
    storeThemeConfiguration: {
      pages: {
        productList: {
          header: {
            title: "Sản phẩm",
            backgroundType: 2,
            backgroundColorHex: "#6e0808",
            backgroundImageUrl: BackgroundHeader,
            colorGroupId: "332c77be-1174-4859-8187-f01e0c40cb59",
          },
          productsProductList: {
            backgroundType: 1,
            backgroundColorHex: "#fff",
            backgroundImageUrl: "",
            colorGroupId: "31c18298-ad73-4276-9339-a487c639141b",
          },
        },
      },
    },
  };

  const contentPage = () => {
    return (
      <div>
        <Theme1ProductList
          categoryList={productCategoriesDefault}
          allProductsWithCategory={allProductsWithCategoryDefault}
          storeThemeData={newStoreThemeDataDefault}
          storeThemeDataHeader={storeThemeHeaderDefault}
          storeThemeDataProduct={storeThemeDataProductDefault}
        />
      </div>
    );
  };

  return <MasterTheme1 contentPage={contentPage()} />;
}
