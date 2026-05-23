import React from "react";
import "./Pagination.scss";

interface PaginationProps {
  meta: {
    currentPage: number;
    totalPages: number;
    itemsPerPage?: number;
    totalItems?: number;
  };
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const currentPage = Number(meta?.currentPage || 1);
  const totalPages = Number(meta?.totalPages || 1);
  const itemsPerPage = Number(meta?.itemsPerPage || 0);
  const totalItems = Number(meta?.totalItems || 0);

  if (totalPages <= 1) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      scrollToTop();
      onPageChange(page);
    }
  };

  const pageNeighbours = 2;
  const totalNumbers = pageNeighbours * 2 + 1;

  let startPage = Math.max(1, currentPage - pageNeighbours);
  let endPage = Math.min(totalPages, currentPage + pageNeighbours);

  if (totalPages > totalNumbers) {
    if (currentPage <= pageNeighbours) {
      endPage = totalNumbers;
    } else if (currentPage + pageNeighbours >= totalPages) {
      startPage = totalPages - totalNumbers + 1;
    }
  }

  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);


  return (
    <div className="pagination-wrapper">
      <div className="pagination">
        <button
          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M8.22 11.28C8.08 11.42 8 11.61 8 11.81V12.19C8 12.39 8.08 12.58 8.22 12.72L13.36 17.85C13.45 17.94 13.58 18 13.71 18C13.85 18 13.98 17.94 14.07 17.85L14.78 17.14C14.87 17.05 14.93 16.92 14.93 16.79C14.93 16.66 14.87 16.53 14.78 16.44L10.33 12L14.78 7.56C14.87 7.47 14.93 7.34 14.93 7.21C14.93 7.07 14.87 6.94 14.78 6.85L14.07 6.15C13.98 6.06 13.85 6 13.71 6C13.58 6 13.45 6.06 13.36 6.15L8.22 11.28Z"
              fill="#1E8CA5"
            />
          </svg>
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15.78 12.72C15.92 12.58 16 12.39 16 12.19V11.81C16 11.61 15.92 11.42 15.78 11.28L10.64 6.15C10.55 6.06 10.42 6 10.29 6C10.15 6 10.02 6.06 9.93 6.15L9.22 6.86C9.13 6.95 9.07 7.08 9.07 7.21C9.07 7.34 9.13 7.47 9.22 7.56L13.67 12L9.22 16.44C9.13 16.53 9.07 16.66 9.07 16.79C9.07 16.92 9.13 17.05 9.22 17.15L9.93 17.85C10.02 17.94 10.15 18 10.29 18C10.42 18 10.55 17.94 10.64 17.85L15.78 12.72Z"
              fill="#1E8CA5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
