"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { cx } from "@/utils/string.helper";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/components/IconDiscount";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Route } from "next";
import ListingImageGallery from "./ListingImageGallery";

export interface GalleryProps {
  images: string[] | StaticImageData[];
  status?: "New in" | "limited edition" | "Sold Out" | "50% Discount";
}

const Gallery: React.FC<GalleryProps> = (props) => {
  const { images, status } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(images[0]);

  const router = useRouter();
  const thisPathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${thisPathname}/?${params.toString()}` as Route);
  };
  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const handleActiveIndex = (index: number) => {
    if (index < 0) index = images.length - 1;
    else if (index >= images.length) index = 0;
    setActiveImage(images[index]);
    setActiveIndex(index);
  };
  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <div className="flex flex-col-reverse gap-2">
        <div className="customScrollBar flex-nowrap flex overflow-auto w-full gap-1">
          {images.map((image, index) => (
            <div
              key={index}
              className={cx(
                "flex-none p-1 border",
                activeIndex == index ? "border-gray-900" : "border-gray-100"
              )}
            >
              <Image
                width={100}
                height={100}
                onClick={() => {
                  setActiveIndex(index);
                  setActiveImage(image);
                }}
                className="aspect-square object-cover cursor-pointer"
                src={image}
                alt="gallery-image"
              />
            </div>
          ))}
        </div>
        <div className="w-3/4 carousel-inner relative overflow-hidden w-full">
          <Image
            width={900}
            height={900}
            className="aspect-square object-cover rounded border border-gray-200"
            src={activeImage}
            alt=""
          />
          {renderStatus()}
          <label
            onClick={() => {
              handleActiveIndex(activeIndex - 1);
            }}
            className="block w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer text-3xl font-bold text-black hover:text-white rounded-full bg-gray-200 hover:bg-gray-900 text-center inset-y-0 left-0 my-auto"
          >
            ‹{/* Replaced ‹ with > */}
          </label>

          <label
            onClick={() => {
              handleActiveIndex(activeIndex + 1);
            }}
            className="block w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer text-3xl font-bold text-black hover:text-white rounded-full bg-gray-200 hover:bg-gray-900 text-center inset-y-0 right-0 my-auto"
          >
            › {/* Replaced › with < */}
          </label>

          <div
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-white text-slate-500 cursor-pointer hover:bg-slate-200 z-10"
            onClick={handleOpenModalImageGallery}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </div>
        </div>
      </div>

      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={images.map((item, index) => {
          return {
            id: index,
            url: item,
          };
        })}
      />
    </>
  );
};

export default Gallery;
