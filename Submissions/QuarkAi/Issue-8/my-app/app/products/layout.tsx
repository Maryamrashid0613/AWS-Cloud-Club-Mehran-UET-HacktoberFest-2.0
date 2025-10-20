import { ShopEaseAppSidebar } from "@/components/shopease-app-sidebar"
import { ShopEaseSiteHeader } from "@/components/shopease-site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ShopEaseAppSidebar />
        <SidebarInset className="flex-1">
          <ShopEaseSiteHeader />
          <div className="flex flex-1 flex-col overflow-auto">
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
