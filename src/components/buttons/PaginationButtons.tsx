import React from "react";
import { Button } from "../ui/button";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface PaginationButtonsProps {
  pageNumbers?: number[];
  totalPages: number;
  pageSize: number;
  count: number;
}
const PaginationButtons = ({
  // pageNumbers,
  totalPages,
  pageSize,
  count,
}: PaginationButtonsProps) => {
  const { updateSearchParams } = useUpdateSearchParams();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const largePagesSeparator = "..." as const;

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(largePagesSeparator);
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className="flex flex-col flex-wrap justify-between gap-4 space-x-2 py-4 md:flex-row md:items-center">
      <div className="text-sm">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, count)} of {count} entries
      </div>
      <div className="scrollbar flex max-w-full items-center space-x-2 overflow-x-auto">
        <Button
          variant="outline"
          onClick={() => updateSearchParams({ page: String(currentPage - 1) })}
          disabled={currentPage === 1}
        >
          <ChevronRight className="rotate-180 md:hidden" />
          <span className="hidden md:block">Previous</span>
        </Button>
        <div className="scrollbar flex items-center gap-2 overflow-x-auto">
          {visiblePageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              onClick={() => updateSearchParams({ page: String(pageNum) })}
              disabled={pageNum === largePagesSeparator}
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => updateSearchParams({ page: String(currentPage + 1) })}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="md:hidden" />
          <span className="hidden md:block">Next</span>
        </Button>
      </div>
    </div>
  );
};

export default PaginationButtons;
