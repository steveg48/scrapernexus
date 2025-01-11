'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface PaginationProps {
  totalItems: number
  itemsPerPage?: number
}

export default function Pagination({ totalItems, itemsPerPage = 10 }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  const startItem = ((currentPage - 1) * itemsPerPage) + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  function createPageURL(pageNumber: number | string) {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {totalItems === 0 ? '0' : `${startItem} - ${endItem}`} of {totalItems} Job posts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={createPageURL(Math.max(1, currentPage - 1))}
            className={`p-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
            aria-disabled={currentPage === 1}
          >
            ‹
          </Link>
          
          <span className="relative z-0 inline-flex">
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              {currentPage}
            </span>
          </span>

          <Link
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            className={`p-2 ${currentPage >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`}
            aria-disabled={currentPage >= totalPages}
          >
            ›
          </Link>
        </div>
      </div>
    </div>
  )
}
