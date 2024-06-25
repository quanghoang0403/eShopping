import { StaticImageData } from "next/image";
import explore1Svg from "@/assets/images/categories/grid/explore1.svg";
import explore2Svg from "@/assets/images/categories/grid/explore2.svg";
import explore3Svg from "@/assets/images/categories/grid/explore3.svg";
import explore5Svg from "@/assets/images/categories/grid/explore5.svg";
import explore6Svg from "@/assets/images/categories/grid/explore6.svg";
import explore9Svg from "@/assets/images/categories/grid/explore9.svg";

import explore1Png from "@/assets/images/categories/grid/explore1.png";
import explore2Png from "@/assets/images/categories/grid/explore2.png";
import explore3Png from "@/assets/images/categories/grid/explore3.png";
import explore5Png from "@/assets/images/categories/grid/explore5.png";
import explore6Png from "@/assets/images/categories/grid/explore6.png";
import explore9Png from "@/assets/images/categories/grid/explore9.png";

export interface ExploreType {
  id: number;
  name: string;
  desc: string;
  image: string | StaticImageData;
  svgBg: string;
  color?: string;
  count?: number;
}


export const DEMO_MORE_EXPLORE_DATA: ExploreType[] = [
  {
    id: 1,
    name: "Backpack",
    desc: "Manufacturar",
    image: explore1Png,
    svgBg: explore1Svg,
    color: "bg-indigo-50",
    count: 155,
  },
  {
    id: 2,
    name: "Shoes",
    desc: "Manufacturar",
    image: explore2Png,
    svgBg: explore2Svg,
    color: "bg-slate-100/80",
    count: 22,
  },
  {
    id: 3,
    name: "Recycled Blanket",
    desc: "Manufacturar",
    image: explore3Png,
    svgBg: explore3Svg,
    color: "bg-violet-50",
    count: 144,
  },
  {
    id: 4,
    name: "Cycling Shorts",
    desc: "Manufacturar",
    image: explore9Png,
    svgBg: explore9Svg,
    color: "bg-orange-50",
    count: 343,
  },
  {
    id: 5,
    name: "Cycling Jersey",
    desc: "Manufacturar",
    image: explore5Png,
    svgBg: explore5Svg,
    color: "bg-blue-50",
    count: 222,
  },
  {
    id: 6,
    name: "Car Coat",
    desc: "Manufacturar",
    image: explore6Png,
    svgBg: explore6Svg,
    color: "bg-orange-50",
    count: 155,
  },
];
