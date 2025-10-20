"use client"

import * as React from "react"
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, LogOut, Store, PackagePlus, Sparkles } from "lucide-react"
import { ShopEaseNavMain } from "@/components/shopease-nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { ShopEaseNavUser } from "@/components/shopease-nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ShopEaseAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, isAdmin } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "AI Assistant",
      url: "/ai-assistant",
      icon: Sparkles,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Store,
    },
    {
      title: "Stock Management",
      url: "/stock",
      icon: PackagePlus,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: ShoppingCart,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ]

  const navSecondary: any[] = []

  const userData = {
    name: profile?.full_name || profile?.email?.split('@')[0] || "User",
    email: profile?.email || "",
    avatar: "/avatars/default.jpg",
    role: profile?.role || "cashier",
    onLogout: handleLogout,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ShopEase</span>
                  <span className="truncate text-xs">Inventory & Sales</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ShopEaseNavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <ShopEaseNavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
