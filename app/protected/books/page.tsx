import AddBookButton from "@/components/books/add-book-button";
import BookFilters from "@/components/books/book-filters";
import BookSearch from "@/components/books/book-search";
import BooksList from "@/components/books/book-lists";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Book Catalog | Library & Book Store Inventory System",
  description: "Browse and search for books in your inventory",
};
export default async function BooksPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    genre?: string;
    author?: string;
    sort?: string;
    page?: string;
  };
}) {
  // Parse search parameters
  const search = searchParams.q || "";
  const genre = searchParams.genre || "";
  const author = searchParams.author || "";
  const sort = searchParams.sort || "title:asc";
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  // Get books from Supabase
  // const query = supabase
  //   .from("books")
  //   .select("*", { count: "exact" })
  //   .ilike("title", `%${search}%`)
  //   .eq("genre", genre || undefined)
  //   .eq("author", author || undefined)
  //   .order(sort.split(":")[0], { ascending: sort.split(":")[1] === "asc" })
  //   .range((page - 1) * pageSize, page * pageSize - 1);
  // Query books with filters

  // const { data: books, count } = await query;

  // Get filter options
  // const [{ data: genres }, { data: authors }] = await Promise.all([
  //   prisma.books.findMany({ select: { genre: true }, distinct: ["genre"] }),
  //   supabase.from("books").select("author").distinct(),
  // ]);
  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    console.error("Error fetching books:", error);
    return;
  }
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Book Catalog</h1>
        {session?.user.role === "admin" ||
        session?.user.role === "librarian" ? (
          <AddBookButton />
        ) : null}
      </div> */}

      <div className="flex flex-col gap-4 md:flex-row">
        {/* <div className="w-full md:w-1/4">
          <BookFilters />
        </div> */}

        <div className="w-full md:w-3/4">
          {/* <BookSearch /> */}
          <BooksList
            books={books}
            totalCount={1}
            currentPage={1}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
