import { redirect } from "next/navigation";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Book } from "lucide-react";
import ThemeToggle from "@/components/layout/theme-toggle";
import { MainNav } from "@/components/hero";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6" />
              <span className="font-bold tracking-tight">Library Manager</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserAccountNav user={user} />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-background p-4">
          <MainNav user={user} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
