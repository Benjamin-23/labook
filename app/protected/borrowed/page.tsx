"use client";
import React, { useState, useEffect } from "react";
import { format, isAfter } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LendedBooksScreen() {
  interface Loan {
    id: number;
    book_id: number;
    user_id: number;
    checkout_date: string;
    due_date: string;
    status: string;
  }

  interface Book {
    id: number;
    title: string;
    isbn: string;
  }

  interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }

  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Record<number, Book>>({});
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLoans();
  }, [currentPage, statusFilter]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("loans")
        .select("*")
        .order("checkout_date", { ascending: false })
        .range(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage - 1,
        );

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: loansData, error: loansError } = await query;

      if (loansError) throw loansError;

      const { count: totalCount } = await supabase
        .from("loans")
        .select("*", { count: "exact", head: true });

      setTotalPages(Math.ceil((totalCount || 0) / itemsPerPage));
      setLoans(loansData as Loan[]);

      if (loansData && loansData.length > 0) {
        const bookIds = Array.from(
          new Set(loansData.map((loan: Loan) => loan.book_id)),
        );
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("id, title, isbn")
          .in("id", bookIds);

        if (booksError) throw booksError;

        const booksMap: Record<number, Book> = {};
        booksData.forEach((book: Book) => {
          booksMap[book.id] = book;
        });
        setBooks(booksMap);

        const userIds = Array.from(
          new Set(loansData.map((loan: Loan) => loan.user_id)),
        );
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, first_name, last_name, email")
          .in("id", userIds);

        if (usersError) throw usersError;

        const usersMap: Record<number, User> = {};
        usersData.forEach((user: User) => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast("Failed to load loan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLoans();
  };

  const handleReturn = async (loanId: number) => {
    try {
      const { error } = await supabase
        .from("loans")
        .update({
          return_date: new Date().toISOString(),
          status: "returned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", loanId);

      if (error) throw error;

      const loan = loans.find((l) => l.id === loanId);
      if (loan) {
        await supabase.rpc("increment_book_inventory", {
          book_id: loan.book_id,
          increment_by: 1,
        });
      }

      toast("Book has been marked as returned");

      fetchLoans();
    } catch (error) {
      console.error("Error returning book:", error);
      toast("Failed to return book. Please try again.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "returned":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Returned
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Overdue
          </Badge>
        );
      case "active":
      default:
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Active
          </Badge>
        );
    }
  };

  const filteredLoans = loans.filter((loan) => {
    if (!searchQuery) return true;

    const bookTitle = books[loan.book_id]?.title?.toLowerCase() || "";
    const userName = users[loan.user_id]
      ? `${users[loan.user_id].first_name} ${users[loan.user_id].last_name}`.toLowerCase()
      : "";
    const userEmail = users[loan.user_id]?.email?.toLowerCase() || "";
    const searchTerm = searchQuery.toLowerCase();

    return (
      bookTitle.includes(searchTerm) ||
      userName.includes(searchTerm) ||
      userEmail.includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Lended Books</CardTitle>
              <CardDescription>
                Manage and track all books currently lent out to users
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/admin/checkout")}
              className="mt-4 sm:mt-0 bg-primary"
            >
              New Checkout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form
                onSubmit={handleSearch}
                className="flex w-full max-w-sm items-center space-x-2"
              >
                <Input
                  placeholder="Search by book title or user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Checkout Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.length > 0 ? (
                      filteredLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">
                            {books[loan.book_id]?.title || "Unknown Book"}
                          </TableCell>
                          <TableCell>
                            {users[loan.user_id] ? (
                              <>
                                <div>{`${users[loan.user_id].first_name} ${users[loan.user_id].last_name}`}</div>
                                <div className="text-sm text-muted-foreground">
                                  {users[loan.user_id].email}
                                </div>
                              </>
                            ) : (
                              "Unknown User"
                            )}
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(loan.checkout_date),
                              "MMM dd, yyyy",
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(loan.due_date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>{getStatusBadge(loan.status)}</TableCell>
                          <TableCell className="text-right">
                            {loan.status !== "returned" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReturn(loan.id)}
                              >
                                Return
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No loans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
