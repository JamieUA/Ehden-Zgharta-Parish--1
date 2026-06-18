"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Newspaper,
  Camera,
  Video,
  Clock,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Mass Times", href: "/admin/dashboard/mass-times", icon: Clock },
  { title: "News & Articles", href: "/admin/dashboard/news", icon: Newspaper },
  { title: "Photo Gallery", href: "/admin/dashboard/gallery", icon: Camera },
  { title: "Videos", href: "/admin/dashboard/videos", icon: Video },
]

const secondaryItems = [
  { title: "Settings", href: "/admin/dashboard/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === "/admin/dashboard"
      ? pathname === href
      : pathname.startsWith(href)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-2 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-accent border border-sidebar-border shadow-sm">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/parish%20logo%202-GQnfE9BeZQCviAkTifBUZIW21fgdDk.jpg"
              alt="Parish logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-serif text-sm font-semibold leading-tight text-sidebar-foreground">
              Parish Admin
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Ehden &amp; Zgharta
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Website">
                  <Link href="/" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={() => router.push("/admin/login")}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
