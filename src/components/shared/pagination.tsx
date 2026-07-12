import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "../ui/button";
import { cn } from "@/lib";

interface Props {
  onPageChange: (page: number) => void;
  page: number;
  pageSize: number;
  total: number;
}

export const Pagination = ({ onPageChange, page, pageSize, total }: Props) => {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const renderPageButton = (index: number) => {
    return (
      <Button
        className={cn(page === index && "bg-black text-white dark:bg-white dark:text-black")}
        disabled={page === index}
        key={index}
        onClick={() => onPageChange(index)}
        size="icon-sm"
        variant="outline"
      >
        {index}
      </Button>
    );
  };

  const renderButtons = () => {
    const numbers = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(renderPageButton(i));
      }
    } else {
      numbers.push(renderPageButton(1));
      if (page <= 2) {
        for (let i = 2; i <= 4; i++) {
          numbers.push(renderPageButton(i));
        }
        numbers.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>,
        );
      } else if (page >= totalPages - 3) {
        numbers.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>,
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          numbers.push(renderPageButton(i));
        }
      } else {
        numbers.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>,
        );
        for (let i = page - 1; i <= page + 1; i++) {
          numbers.push(renderPageButton(i));
        }
        numbers.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>,
        );
      }
      numbers.push(renderPageButton(totalPages));
    }
    return numbers;
  };

  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-sm font-medium">
        Showing {startIndex} to {endIndex} of {total} items
      </p>
      <div className="flex items-center gap-x-2">
        <Button disabled={!hasPreviousPage} onClick={() => onPageChange(1)} size="icon-sm" variant="outline">
          <ChevronsLeft />
        </Button>
        <Button disabled={!hasPreviousPage} onClick={() => onPageChange(page - 1)} size="icon-sm" variant="outline">
          <ChevronLeft />
        </Button>
        {renderButtons()}
        <Button disabled={!hasNextPage} onClick={() => onPageChange(page + 1)} size="icon-sm" variant="outline">
          <ChevronRight />
        </Button>
        <Button disabled={!hasNextPage} onClick={() => onPageChange(totalPages)} size="icon-sm" variant="outline">
          <ChevronsRight />
        </Button>
      </div>
      <div></div>
    </div>
  );
};
