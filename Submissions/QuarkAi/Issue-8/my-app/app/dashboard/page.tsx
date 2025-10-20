import { ShopEaseAppSidebar } from "@/components/shopease-app-sidebar"
import { ShopEaseSectionCards } from "@/components/shopease-section-cards"
import { ShopEaseChartInteractive } from "@/components/shopease-chart-interactive"
import { ShopEaseChartLowStock } from "@/components/shopease-chart-low-stock"
import { ShopEaseDataTable } from "@/components/shopease-data-table"
import { ShopEaseSiteHeader } from "@/components/shopease-site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ShopEaseAppSidebar />
        <SidebarInset className="flex-1">
          <ShopEaseSiteHeader />
          <div className="flex flex-1 flex-col overflow-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <ShopEaseSectionCards />
                <div className="px-4 lg:px-6 grid gap-4 md:gap-6 lg:grid-cols-2">
                  <ShopEaseChartInteractive />
                  <ShopEaseChartLowStock />
                </div>
                <ShopEaseDataTable />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
