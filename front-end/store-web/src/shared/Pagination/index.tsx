import React, { FC, useEffect } from 'react'
import { twFocusClass } from '@/utils/string.helper'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { productActions } from '@/redux/features/productSlice'

export interface PaginationProps {
  pageCount: number
  onApply: () => Promise<void>
}

const Pagination: FC<PaginationProps> = ({ pageCount = 1, onApply }) => {
  const dispatch = useAppDispatch()
  const getProductRequest = useAppSelector((state) => state.product.getProductRequest as IGetProductsRequest)

  const setPageNumber = (pageNumber: number) => {
    dispatch(productActions.updateRequest({ ...getProductRequest, pageNumber: pageNumber }))
  }

  useEffect(() => {
    onApply()
  }, [getProductRequest.pageNumber])

  return (
    <nav className="nc-Pagination inline-flex space-x-1 text-base font-medium">
      {Array.from(Array(pageCount).keys()).map((pageIndex) => {
        const currentPage = pageIndex + 1
        if (currentPage === getProductRequest.pageNumber) {
          return (
            <span key={currentPage} className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}>
              {currentPage}
            </span>
          )
        }
        return (
          <span
            key={currentPage}
            className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
            onClick={() => setPageNumber(currentPage)}
          >
            {currentPage}
          </span>
        )
      })}
    </nav>
  )
}

export default Pagination
