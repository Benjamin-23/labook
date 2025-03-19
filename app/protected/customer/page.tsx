"use client";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState<any[]>([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    //   const checkUser = async () => {
    //     const {
    //       data: { session },
    //     } = await supabase.auth.getSession();

    // if (!session) {
    //   return redirect("/sign-in");
    // }

    // const { data: profile, error } = await supabase
    //   .from("users")
    //   .select("*")
    //   .eq("email", session.user.email)
    //   .single();

    // if (error || profile.role !== "customer") {
    //   await supabase.auth.signOut();

    //   return redirect("/sign-in");
    // }

    // setUser({ ...session.user, ...profile });
    fetchBooks();
    // fetchMyBooks(session.user.id);
    // };

    // checkUser();
  }, []);

  async function fetchBooks() {
    try {
      const { data, error } = await supabase.from("books").select("*");

      if (error) throw error;
      setBooks((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyBooks(userId: any) {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
           id,
           book_id,
           transaction_type,
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
        .from("books")
        .select("quantity")
        .eq("id", bookId)
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
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user?.id,
            book_id: bookId,
            transaction_type: "lend",
            status: "active",
            due_date: dueDate.toISOString(),
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
      fetchMyBooks(user.id);
      alert(
        "Book borrowed successfully! Due date: " + dueDate.toLocaleDateString(),
      );
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book: " + error.message);
    }
  }

  async function handlePurchase(bookId: any) {
    if (!user) return;

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
    } catch (error) {
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
      fetchMyBooks(user.id);
      alert("Book returned successfully!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book: " + error.message);
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm),
  );

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
                          onClick={() => handleReturn(item.id, item.book_id)}
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
              key={book.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-700 mb-1">By: {book.author}</p>
                <p className="text-gray-500 mb-1">ISBN: {book.isbn}</p>
                <p className="text-gray-500 mb-3">Available: {book.quantity}</p>
                <p className="font-medium mb-4">${book.price}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleLend(book.id)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex-1"
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => handlePurchase(book.id)}
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
