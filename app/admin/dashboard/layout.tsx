"use client"

import type { ReactNode } from "react"
import { useState, useRef, useEffect } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminDataProvider } from "@/components/admin/admin-data"
import { Toaster } from "@/components/ui/sonner"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

// --- Search config ---
const SEARCH_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Media", href: "/admin/media" },
]

// --- Route label map ---
const ROUTE_LABELS: Record<string, string> = {
  "/admin/dashboard":              "Dashboard",
  "/admin/dashboard/mass-times":   "Mass Times",
  "/admin/dashboard/news":         "News & Articles",
  "/admin/dashboard/gallery":      "Photo Gallery",
  "/admin/dashboard/videos":       "Videos",
  "/admin/dashboard/about/parish":    "The Parish",
  "/admin/dashboard/about/history":   "History",
  "/admin/dashboard/about/vicar":     "The Vicar",
  "/admin/dashboard/about/patriarch": "Blessed Patriarch Douaihy",
  "/admin/settings":               "Settings",
  "/admin/settings/profile":       "Settings",
  "/admin/settings/preferences":   "Settings",
}

// --- Mock notifications ---
const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "New order received", time: "2 min ago", read: false },
  { id: 2, text: "Low stock: Dark Truffle Box", time: "1 hr ago", read: false },
  { id: 3, text: "Customer inquiry submitted", time: "3 hr ago", read: true },
]

function Breadcrumb() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <span className="font-serif text-base font-semibold text-foreground">Dashboard</span>
  }

  // Root dashboard — just show "Dashboard"
  if (pathname === "/admin/dashboard" || pathname === "/admin") {
    return (
      <span className="font-serif text-base font-semibold text-foreground">
        Dashboard
      </span>
    )
  }

  // Sub-page — show "Dashboard > Page Name"
  const pageLabel = ROUTE_LABELS[pathname] ?? "Settings"

  return (
    <span className="flex items-center gap-1.5 font-serif text-base font-semibold">
      <Link
        href="/admin/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Dashboard
      </Link>
      <svg
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
      </svg>
      <span className="text-foreground">{pageLabel}</span>
    </span>
  )
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Search
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredItems = searchQuery.trim().length > 0
    ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  // Profile
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setMobileSearchOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <AdminDataProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
            {/* Left: trigger + breadcrumb */}
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb />

            <div className="ml-auto flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                {/* Mobile: icon button to toggle search */}
                <button
                  onClick={() => {
                    setMobileSearchOpen(p => {
                      const next = !p
                      if (next) setTimeout(() => searchInputRef.current?.focus(), 0)
                      return next
                    })
                  }}
                  aria-label="Search"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:hidden"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
                  </svg>
                </button>

                {/* Search input: inline on sm+, dropdown panel on mobile when toggled */}
                <div
                  className={`${mobileSearchOpen ? "absolute right-0 top-full mt-1.5 w-64 z-50 rounded-md shadow-lg" : "hidden"} sm:static sm:mt-0 sm:block sm:w-auto sm:rounded-none sm:shadow-none`}
                >
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
                    <svg className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
                    </svg>
                    <input
                      ref={searchInputRef}
                      className="w-full bg-transparent outline-none placeholder:text-muted-foreground sm:w-56"
                      placeholder="Search pages…"
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                      onFocus={() => setSearchOpen(true)}
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(""); setSearchOpen(false) }} className="text-muted-foreground hover:text-foreground">
                        <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {searchOpen && filteredItems.length > 0 && (
                    <div className="absolute left-0 top-full mt-1.5 w-full min-w-[200px] rounded-md border bg-popover p-1 shadow-md">
                      {filteredItems.map(item => (
                        <button
                          key={item.href}
                          className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                          onClick={() => { router.push(item.href); setSearchOpen(false); setMobileSearchOpen(false); setSearchQuery("") }}
                        >
                          <svg className="h-3.5 w-3.5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {searchOpen && searchQuery.trim().length > 0 && filteredItems.length === 0 && (
                    <div className="absolute left-0 top-full mt-1.5 w-full rounded-md border bg-popover px-3 py-4 text-center text-sm text-muted-foreground shadow-md">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setNotifOpen(p => !p); setProfileOpen(false) }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-80 rounded-md border bg-popover shadow-md">
                    <div className="flex items-center justify-between border-b px-4 py-2.5">
                      <span className="text-sm font-semibold text-popover-foreground">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-muted-foreground hover:text-foreground">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50 ${!n.read ? "bg-accent/20" : ""}`}
                        >
                          <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`} />
                          <div className="flex-1 space-y-0.5">
                            <p className="text-sm text-popover-foreground">{n.text}</p>
                            <p className="text-xs text-muted-foreground">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {notifications.length === 0 && (
                      <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications</p>
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => { setProfileOpen(p => !p); setNotifOpen(false) }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-muted text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  A
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 rounded-md border bg-popover shadow-md">
                    <div className="border-b px-4 py-3">
                      <p className="text-sm font-semibold text-popover-foreground">Admin</p>
                      <p className="text-xs text-muted-foreground">admin@parish.lb</p>
                    </div>
                    <div className="p-1">
                      {[
                        { label: "Profile settings", href: "/admin/settings/profile" },
                        { label: "Preferences", href: "/admin/settings/preferences" },
                      ].map(item => (
                        <button
                          key={item.href}
                          onClick={() => { router.push(item.href); setProfileOpen(false) }}
                          className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t p-1">
                      <button
                        onClick={() => { router.push("/admin/logout"); setProfileOpen(false) }}
                        className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors />
    </AdminDataProvider>
  )
}
