// components/layout/main-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  Calendar,
  CreditCard,
  Home,
  LayoutDashboard,
  LineChart,
  Settings,
  Truck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/protected",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Inventory",
    href: "/protected/books",
    icon: <Book className="mr-2 h-4 w-4" />,
    roles: ["Admin", "librarian"],
  },
  {
    title: "loaned Books",
    href: "/protected/borrowed",
    icon: <Calendar className="mr-2 h-4 w-4" />,
    roles: ["Admin", "librarian"],
  },
  {
    title: "Sales",
    href: "/protected/sales",
    icon: <CreditCard className="mr-2 h-4 w-4" />,
    roles: ["Admin", "librarian"],
  },
  {
    title: "Purchases",
    href: "/protected/purchases",
    icon: <Truck className="mr-2 h-4 w-4" />,
    roles: ["Admin"],
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="mr-2 h-4 w-4" />,
    roles: ["Admin"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <LineChart className="mr-2 h-4 w-4" />,
    roles: ["Admin", "librarian"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

import { type User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
interface MainNavProps {
  user: User | null;
}

export function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();
  const [role, setRole] = useState("customer");

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data: userRole, error } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .single();

        if (userRole) {
          setRole(userRole.role);
        }
      }
    };

    fetchRole();
  }, [user]);
  const userRole = role;

  if (userRole === "Customer") {
    const customerNavItems: NavItem[] = [
      {
        title: "Book List",
        href: "/protected/customer",
        icon: <Book className="mr-2 h-4 w-4" />,
      },
      {
        title: "My Collection",
        href: "/protected/customer/collection",
        icon: <Home className="mr-2 h-4 w-4" />,
      },
      {
        title: "Book Borrowed",
        href: "/protected/customer/borrowed",
        icon: <Calendar className="mr-2 h-4 w-4" />,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: <Settings className="mr-2 h-4 w-4" />,
      },
    ];

    return (
      <nav className="flex flex-col gap-1">
        {customerNavItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50",
              )}
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        // Check if the item should be shown based on user role
        if (item.roles && !item.roles.includes(userRole)) {
          return null;
        }

        return (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-secondary/50",
              )}
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
