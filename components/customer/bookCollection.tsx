"use client";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function BookCollection({ user }: any) {
  // const [user, setUser] = useState(null);
  const [books, setBooks] = useState<any[]>([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    // const checkUser = async () => {
    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser();

    //   console.log(user, "user available");

    // if (!session) {
    //   return redirect("/sign-in");
    // }

    const fetchUserProfile = async () => {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .single();

      // if (error || profile.role !== "customer") {
      //   await supabase.auth.signOut();

      //   return redirect("/sign-in");
      // }
    };

    // setUser(user as null);
    // console.log(fetchUserProfile, "user profile");

    fetchBooks();
    fetchMyBooks(user.id);
    // };
    // checkUser();
  }, [user]);

  async function fetchBooks() {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select(
          "book_id,quantity,selling_price,books(id, title, author,genre,publication_date, isbn)",
        );

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyBooks(userId: any) {
    try {
      const { data, error } = await supabase
        .from("loan")
        .select(
          `
           id,
           book_id,
           status,
           due_date,
           created_at,
           books (*)
         `,
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooks((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function handleLend(bookId: any) {
    if (!user) return;

    try {
      // Check if book is available
      const { data: book, error: bookError } = await supabase
        .from("inventory")
        .select("quantity")
        .eq("book_id", bookId)
        .single();

      if (bookError) throw bookError;

      if (book.quantity <= 0) {
        alert("This book is not available for lending");
        return;
      }

      // Calculate due date (2 weeks from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Create transaction record
      const { data, error: transactionError } = await supabase
        .from("loan")
        .insert([
          {
            book_id: bookId,
            user_id: user.id,
            checkout_date: new Date().toISOString(),
            due_date: dueDate.toISOString(),
            return_date: null,
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (transactionError) throw transactionError;
      console.log(data, "lend");
      // Update book quantity
      console.log(book.quantity, "books");
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: book.quantity - 1 })
        .eq("book_id", bookId);

      if (updateError) throw updateError;

      // Refresh data
      fetchBooks();
      fetchMyBooks(user.id);
      alert(
        "Book borrowed successfully! Due date: " + dueDate.toLocaleDateString(),
      );
    } catch (error: any) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book: " + error.message);
    }
  }

  async function handlePurchase(bookId: any) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (!user) return;
    console.log("Uko kweli");

    try {
      // Check if book is available
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("quantity, price")
        .eq("id", bookId)
        .single();

      if (bookError) throw bookError;

      if (book.quantity <= 0) {
        alert("This book is not available for purchase");
        return;
      }

      // Confirm purchase
      if (!confirm(`Purchase this book for $${book.price}?`)) {
        return;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            book_id: bookId,
            transaction_type: "purchase",
            status: "completed",
            amount: book.price,
          },
        ]);

      if (transactionError) throw transactionError;

      // Update book quantity
      const { error: updateError } = await supabase
        .from("books")
        .update({ quantity: book.quantity - 1 })
        .eq("id", bookId);

      if (updateError) throw updateError;

      // Refresh data
      fetchBooks();
      alert("Book purchased successfully!");
    } catch (error: any) {
      console.error("Error purchasing book:", error);
      alert("Failed to purchase book: " + error.message);
    }
  }

  async function handleReturn(transactionId: any, bookId: any) {
    try {
      // Update transaction status
      const { error: transactionError } = await supabase
        .from("transactions")
        .update({ status: "returned" })
        .eq("id", transactionId);

      if (transactionError) throw transactionError;

      // Increment book quantity
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("quantity")
        .eq("id", bookId)
        .single();

      if (bookError) throw bookError;

      const { error: updateError } = await supabase
        .from("books")
        .update({ quantity: book.quantity + 1 })
        .eq("id", bookId);

      if (updateError) throw updateError;

      // Refresh data
      fetchBooks();
      // fetchMyBooks(user.id);
      alert("Book returned successfully!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book: " + error.message);
    }
  }
  // filtered data

  const filteredBooks = books.filter(
    (book) =>
      book.books.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.books.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.books.isbn.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // console.log(filteredBooks, "my filtered data");

  // loading
  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <div>
          <span className="mr-4">
            Welcome, {user?.full_name || user?.email || "Guest"}
          </span>
        </div>
      </div>

      {/* My Books Section */}
      {myBooks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Borrowed Books</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Author</th>
                  <th className="py-2 px-4 border-b text-left">
                    Borrowed Date
                  </th>
                  <th className="py-2 px-4 border-b text-left">Due Date</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {myBooks
                  .filter((item) => item?.transaction_type === "lend")
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{item.books.title}</td>
                      <td className="py-2 px-4 border-b">
                        {item.books.author}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(item.due_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleReturn(item?.id, item?.book_id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Available Books Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Books</h2>
          <div>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.books.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {book.books.title}
                </h3>
                <p className="text-gray-700 mb-1">By: {book.books.author}</p>
                <p className="text-gray-500 mb-1">ISBN: {book.books.isbn}</p>
                <p className="text-gray-500 mb-3">Available: {book.quantity}</p>
                <p className="font-medium mb-4">${book.selling_price}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleLend(book.books.id)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex-1 cursor-pointer"
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => handlePurchase(book.books.id)}
                    className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 flex-1"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No books found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
