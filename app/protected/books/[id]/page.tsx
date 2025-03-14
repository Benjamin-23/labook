import BookActions from "@/components/books/book-action";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { cookies } from "next/headers";
import Image from "next/image";
import { BookOpen, DollarSign, Package, UsersRound } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoanHistory } from "@/components/books/loan-history";

export default async function Page({ params }: { params: { id: string } }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const books = await supabase.from("book").select("*");
  const inventorys = await supabase.from("inventory").select("*");
  const isAdmin = session?.user.user_metadata.role === "admin";
  const isLibrarian = session?.user.user_metadata.role === "librarian";
  const isStaff = isAdmin || isLibrarian;

  const { data: book } = await supabase
    .from("book")
    .select("*")
    .eq("id", params.id)
    .single();
  const { data: inventory } = await supabase
    .from("inventory")
    .select("*")
    .eq("book_id", params.id)
    .single();

  // Get loan history for this book
  const { data: loanHistory } = await supabase
    .from("loans")
    .select("*")
    .eq("book_id", params.id)
    .order("created_at", { ascending: false });
  return (
    <div className="flex flex-col gap-4">
      <BookActions book={books} inventory={inventorys} />
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href="/protected/books">Back to Books</Link>
        </Button>
      </CardFooter>

      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{book?.title}</h1>
          {isStaff && <BookActions book={books} inventory={inventorys} />}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Book Cover and Basic Info */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border bg-muted">
              {book?.cover_image ? (
                <Image
                  src={book?.cover_image}
                  alt={book?.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  ISBN:
                </span>
                <span>{book?.isbn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pages:
                </span>
                <span>{book?.page_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Language:
                </span>
                <span>{book?.language}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Published:
                </span>
                <span>{formatDate(book?.publication_date)}</span>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6 md:col-span-2">
            <div>
              <h2 className="text-xl font-semibold">About this book</h2>
              <p className="mt-2 text-muted-foreground">
                {book?.description || "No description available."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Author:
                </span>
                <span className="font-medium">{book?.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Publisher:
                </span>
                <span>{book?.publisher}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Genre:
                </span>
                <Badge variant="outline">{book?.genre}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      In Stock
                    </p>
                    <p className="text-2xl font-bold">{inventory?.quantity}</p>
                  </div>
                </CardContent>
              </Card>

              {inventory?.is_for_sale && (
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Price
                      </p>
                      <p className="text-2xl font-bold">
                        ${inventory?.selling_price.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Location:
                </span>
                <span>{inventory?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Condition:
                </span>
                <span>{inventory?.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Available for:
                </span>
                <div className="flex gap-2">
                  {inventory?.is_for_sale && <Badge>Sale</Badge>}
                  {inventory?.is_for_loan && <Badge>Loan</Badge>}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {inventory?.is_for_loan && inventory?.quantity > 0 && (
                <Button>Borrow Book</Button>
              )}
              {inventory?.is_for_sale && inventory?.quantity > 0 && (
                <Button variant="outline">Add to Cart</Button>
              )}
            </div>
          </div>
        </div>

        {/* Loan History - Only visible to staff */}
        {isStaff && loanHistory && loanHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Loan History</h2>
            <LoanHistory loans={loanHistory} />
          </div>
        )}
      </div>
    </div>
  );
}
