import React, { FC } from "react";
import { twFocusClass } from "@/utils/string.helper";

export interface PaginationProps {
  pageNumber?: number
  pageCount?: number
  setPageNumber?: (value: number) => void;
}

const Pagination: FC<PaginationProps> = ({ pageNumber = 1, pageCount = 1, setPageNumber }) => {
  return (
    <nav
      className='nc-Pagination inline-flex space-x-1 text-base font-medium'
    >
      {[...Array(pageCount)].map((pageIndex) => {
         const currentPage = pageIndex + 1;
         if (currentPage === pageNumber) {
          return (
            <span
              key={currentPage}
              className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}
            >
              {currentPage}
            </span>
          );
        }
        return (
          <span
            key={currentPage}
            className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
            onClick={() => setPageNumber && setPageNumber(currentPage)}
          >
            {currentPage}
          </span>
        );
      })}
    </nav>
  );
};

export default Pagination;
