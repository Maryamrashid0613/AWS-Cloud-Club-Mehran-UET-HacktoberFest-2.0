import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ShopEaseAppSidebar } from "@/components/shopease-app-sidebar"
import { ShopEaseSiteHeader } from "@/components/shopease-site-header"

export default function AIAssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ShopEaseAppSidebar />
      <SidebarInset>
        <ShopEaseSiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
