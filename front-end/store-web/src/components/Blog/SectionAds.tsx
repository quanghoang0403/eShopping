import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";

export interface SectionAdsProps {
  className?: string;
  img: StaticImageData
}

const SectionAds: FC<SectionAdsProps> = ({ className = "", img }) => {
  return (
    <a href="/#" className={`nc-SectionAds block w-full ${className}`}>
      <Image alt="ads" className="w-full" src={img} />
    </a>
  );
};

export default SectionAds;
