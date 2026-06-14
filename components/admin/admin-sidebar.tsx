"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Home,
  Info,
  Clock,
  BookOpen,
  Newspaper,
  Church,
  FileText,
  Clapperboard,
  Phone,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type NavChild = { title: string; href: string }
type NavItem = {
  title: string
  href: string
  icon: typeof Home
  children?: NavChild[]
}

const overviewItem: NavItem = {
  title: "Overview",
  href: "/admin/dashboard",
  icon: LayoutDashboard,
}

// Mirrors the public website navigation order.
const navItems: NavItem[] = [
  { title: "Home", href: "/admin/dashboard/home", icon: Home },
  {
    title: "About",
    href: "/admin/dashboard/about",
    icon: Info,
    children: [
      { title: "The Parish", href: "/admin/dashboard/about" },
      { title: "History", href: "/admin/dashboard/about/history" },
      { title: "The Vicar", href: "/admin/dashboard/about/vicar" },
      { title: "Blessed Patriarch Douaihy", href: "/admin/dashboard/about/patriarch" },
    ],
  },
  { title: "Mass Times", href: "/admin/dashboard/mass-times", icon: Clock },
  { title: "Yanabi3", href: "/admin/dashboard/yanabi3", icon: BookOpen },
  { title: "News", href: "/admin/dashboard/news", icon: Newspaper },
  { title: "Churches", href: "/admin/dashboard/churches", icon: Church },
  {
    title: "Services",
    href: "/admin/dashboard/services",
    icon: FileText,
    children: [
      { title: "Overview", href: "/admin/dashboard/services" },
      { title: "The First Sacrifice", href: "/admin/dashboard/services/first-sacrifice" },
      { title: "Marriage Certificate", href: "/admin/dashboard/services/marriage-certificate" },
      { title: "Certificate of Confirmation", href: "/admin/dashboard/services/confirmation-certificate" },
      { title: "Death Certificate", href: "/admin/dashboard/services/death-certificate" },
    ],
  },
  {
    title: "Media",
    href: "/admin/dashboard/media",
    icon: Clapperboard,
    children: [
      { title: "Zgharta Channel", href: "/admin/dashboard/media/zgharta-channel" },
      { title: "Radio Ehden", href: "/admin/dashboard/media/radio-ehden" },
      { title: "Photo Gallery", href: "/admin/dashboard/gallery" },
      { title: "Videos", href: "/admin/dashboard/videos" },
    ],
  },
  { title: "Contact", href: "/admin/dashboard/contact", icon: Phone },
]

const secondaryItems = [
  { title: "Settings", href: "/admin/dashboard/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname === href

  const isWithin = (item: NavItem) =>
    item.children
      ? item.children.some((c) => pathname === c.href) ||
        pathname.startsWith(item.href + "/")
      : pathname === item.href

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
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(overviewItem.href)}
                  tooltip={overviewItem.title}
                >
                  <Link href={overviewItem.href}>
                    <overviewItem.icon className="h-4 w-4" />
                    <span>{overviewItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) =>
                item.children ? (
                  <CollapsibleNavItem
                    key={item.href}
                    item={item}
                    defaultOpen={isWithin(item)}
                    pathname={pathname}
                  />
                ) : (
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
                ),
              )}
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

function CollapsibleNavItem({
  item,
  defaultOpen,
  pathname,
}: {
  item: NavItem
  defaultOpen: boolean
  pathname: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={defaultOpen && !open}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === child.href}
                >
                  <Link href={child.href}>
                    <span>{child.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
