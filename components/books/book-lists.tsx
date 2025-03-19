import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as utils from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import BookActions from "./book-action";
import AddBookForm from "./add-book";

interface BooksListProps {
  books: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  inventory: any[];
}

export default function BooksList({
  books,
  totalCount,
  currentPage,
  pageSize,
  inventory,
}: BooksListProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!books || books.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No books found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddBookForm />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => {
          const inventory =
            Array.isArray(book.inventory) && book.inventory.length > 0
              ? book.inventory[0]
              : null;
          return (
            <Card
              key={book.id}
              className="flex h-full flex-col overflow-hidden"
            >
              {/* <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div> */}
              <CardHeader className="flex-grow pb-2">
                <CardTitle className="line-clamp-2 text-lg">
                  <Link href={`/books/${book.id}`} className="hover:underline">
                    {book.title}
                  </Link>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {book.author || "Unknown Author"}
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {book?.genre}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      ${inventory?.selling_price || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inventory?.quantity > 0
                        ? `${inventory.quantity} in stock`
                        : "Out of stock"}
                    </p>
                  </div>
                  {/* <p className="text-xs text-muted-foreground">
                    {book.publication_date
                      ? utils.formatDate(book.publication_date)
                      : "Unknown date"}
                  </p> */}
                </div>
              </CardContent>
              {/* <BookActions book={books} inventory={inventory} /> */}
              <CardFooter className="pt-0">
                <Button
                  asChild
                  className="w-full"
                  disabled={!inventory || inventory.stock <= 0}
                >
                  <Link href={`/protected/books/${book.id}`}>
                    {inventory && inventory.quantity > 0
                      ? "View Details"
                      : "Out of Stock"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
                aria-disabled={currentPage <= 1}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                aria-disabled={currentPage >= totalPages}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
