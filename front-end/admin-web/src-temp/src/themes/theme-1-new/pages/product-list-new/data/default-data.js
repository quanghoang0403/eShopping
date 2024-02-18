import { randomGuid } from "../../../../utils/helpers";
import ChanhTuyetVaiHoaHong from "../../../assets/images/chanh_tuyet_vai_hoa_hong.png";
import MatchaDua from "../../../assets/images/matcha_dua.png";
import PhoMaiTuyetHoaHong from "../../../assets/images/pho_mai_tuyet_hoa_hong.png";
import { ComboType } from "../../../constants/combo.constants";

const idCategory = {
  comboCoffee: randomGuid(),
  comboTra: randomGuid(),
  iceBlended: randomGuid(),
  yogurt: randomGuid(),
  milk: randomGuid(),
};
export const currency = "đ";

export const listCategoriesNavbar = [
  {
    id: idCategory.comboCoffee,
    name: "Hoa tuyết Bery Bery | Cappuchino",
  },
  {
    id: idCategory.comboTra,
    name: "Combo trà",
  },
  {
    id: idCategory.iceBlended,
    name: "Ice blended",
  },
  {
    id: idCategory.yogurt,
    name: "Yogurt",
  },
  {
    id: idCategory.milk,
    name: "Milk",
  },
];

export const listSectionGroups = [
  {
    id: idCategory.comboCoffee,
    name: "Hoa tuyết Bery Bery | Cappuchino",
    comboTypeId: ComboType.SPECIFIC,
    originalPrice: 200000,
    sellingPrice: 180000,
    thumbnail: ChanhTuyetVaiHoaHong,
    isCombo: true,
    products: [
      {
        id: randomGuid(),
        name: "Hoa tuyết Bery Bery | Cappuchino",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: ChanhTuyetVaiHoaHong,
        isCombo: true,
      },
    ],
  },
  {
    id: idCategory.comboTra,
    name: "Combo trà",
    comboTypeId: ComboType.FLEXIBLE,
    products: [
      {
        id: randomGuid(),
        name: "Combo trà: Trà thảo mộc | Trà nhãn sen (M)",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: ChanhTuyetVaiHoaHong,
        isCombo: true,
      },

      {
        id: randomGuid(),
        name: "Combo trà: Trà thảo mộc | Trà Ô Long Dâu",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: MatchaDua,
        isCombo: true,
      },
      {
        id: randomGuid(),
        name: "Combo trà: Trà nhãn sen (M) | Trà nhãn sen (M)",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: PhoMaiTuyetHoaHong,
        isCombo: true,
      },
      {
        id: randomGuid(),
        name: "Combo trà:  Trà nhãn sen (M) | Trà Ô Long Dâu",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: MatchaDua,
        isCombo: true,
      },
      {
        id: randomGuid(),
        name: "Combo trà:  Trà đào | Trà chanh",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: MatchaDua,
        isCombo: true,
      },
      {
        id: randomGuid(),
        name: "Trà thảo mộc | Trà đào",
        originalPrice: 200000,
        sellingPrice: 150000,
        thumbnail: PhoMaiTuyetHoaHong,
        isCombo: true,
      },
    ],
  },
  {
    id: idCategory.iceBlended,
    name: "Ice blended",
    products: [
      {
        id: "46bc1b4f-fb51-46b1-9be1-f33dfd15833c",
        name: "Hồng trà Caramel dừa đá xay",
        originalPrice: 65000,
        sellingPrice: 32500,
        isFlashSale: true,
        thumbnail: PhoMaiTuyetHoaHong,
        discountValue: 55,
        isDiscountPercent: true
      },
      {
        id: "7bef60ed-6882-4aa2-87eb-cdf7cb046316",
        name: "Oreo Cà phê sữa đá xay",
        originalPrice: 60000,
        sellingPrice: 60000,
        isFlashSale: false,
        thumbnail: MatchaDua,
      },
      {
        id: "576e8e11-0ef9-4a8d-8dc8-19ae257f396b",
        name: "Chanh đá xay",
        originalPrice: 50000,
        sellingPrice: 50000,
        isFlashSale: false,
        thumbnail: ChanhTuyetVaiHoaHong,
      },
      {
        id: "0a23a3d6-cc99-4ffe-b782-03eb0fa07e0b",
        name: "Nhãn đá xay",
        originalPrice: 70000,
        sellingPrice: 70000,
        isFlashSale: false,
        thumbnail: PhoMaiTuyetHoaHong,
      },
      {
        id: "c41f53af-8d1b-432b-afc4-e99347b1ba18",
        name: "Trà Đào đá xay",
        originalPrice: 63000,
        sellingPrice: 63000,
        isFlashSale: false,
        thumbnail: MatchaDua,
      },
      {
        id: "4bd353e2-9b02-4316-a0b7-cd517af20bac",
        name: "Matcha Đá xay",
        originalPrice: 60000,
        sellingPrice: 60000,
        isFlashSale: false,
        thumbnail: ChanhTuyetVaiHoaHong,
      },
      {
        id: "6ab9b674-129f-4d47-948c-5e43e17902cb",
        name: "Cà phê Caramel đá xay",
        originalPrice: 59000,
        sellingPrice: 29500,
        isFlashSale: false,
        thumbnail: PhoMaiTuyetHoaHong,
        discountValue: 55,
        isDiscountPercent: true
      },
    ],
  },
  {
    id: idCategory.yogurt,
    name: "Yogurt",
    products: [
      {
        id: "a8a4ecf0-bb4d-49ec-a97f-93f956baf89f",
        name: "Sữa chua Xoài Đác Thơm",
        originalPrice: 66000,
        sellingPrice: 30000,
        discountValue: 55,
        isFlashSale: true,
        thumbnail: ChanhTuyetVaiHoaHong,
        isDiscountPercent: true
      },
      {
        id: "fa5f1b56-2370-46b1-a990-e15a956266c0",
        name: "Yogurt Phúc bồn tử",
        originalPrice: 47000,
        sellingPrice: 47000,
        isFlashSale: false,
        thumbnail: PhoMaiTuyetHoaHong,
      },
      {
        id: "cbc51a71-7c11-43cc-86e0-8a4d62563b35",
        name: "Hoa tuyết Bery Bery",
        originalPrice: 69000,
        sellingPrice: 69000,
        isFlashSale: false,
        thumbnail: MatchaDua,
      },
      {
        id: "df9390d7-bed9-462b-b57b-08db9fbfe2a3",
        name: "Nho Nguyên Chất",
        originalPrice: 35000,
        sellingPrice: 35000,
        isFlashSale: false,
        thumbnail: MatchaDua,
      },
    ],
  },
  {
    id: idCategory.milk,
    name: "Milk",
    products: [
      {
        id: "78118e77-580a-4df6-b51b-b24f277a31ee",
        name: "TH True milk",
        originalPrice: 15000,
        sellingPrice: 15000,
        isFlashSale: false,
        thumbnail: ChanhTuyetVaiHoaHong,
      },
      {
        id: "48bbe8a5-66ce-447f-b7ff-23fb3041e8a2",
        name: "Vina Milk",
        originalPrice: 25000,
        sellingPrice: 25000,
        isFlashSale: false,
        thumbnail: PhoMaiTuyetHoaHong,
      },
    ],
  },
];
