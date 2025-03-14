import AddBookForm from "@/components/books/add-book";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="animate-in flex-1 flex flex-col gap-6 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            Library and Book Store Inventory System
          </h1>
          <p className="text-gray-500">
            Manage your library and bookstore inventory in one place
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-semibold mb-2">Book Catalog</h2>
              <p className="text-gray-600">
                Browse and search through all books in inventory
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                View Catalog
              </button>
            </div>

            <div className="p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-semibold mb-2">Lending Management</h2>
              <p className="text-gray-600">
                Track book loans, returns and due dates
              </p>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Manage Loans
              </button>
            </div>

            <div className="p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-semibold mb-2">Sales & Purchases</h2>
              <p className="text-gray-600">
                Process sales transactions and manage purchases
              </p>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                Open POS
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold">2,456</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Books Out</p>
                <p className="text-2xl font-bold">183</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-500">12</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">Sales Today</p>
                <p className="text-2xl font-bold text-green-500">$842</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <AddBookForm />
    </div>
  );
}
