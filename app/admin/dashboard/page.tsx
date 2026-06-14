"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Newspaper,
  Camera,
  Video,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  PencilLine,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminData } from "@/components/admin/admin-data"

export default function DashboardOverviewPage() {
  const { news, photos, videos, churches } = useAdminData()

  const published = news.filter((n) => n.status === "published").length
  const drafts = news.filter((n) => n.status === "draft").length

  const stats = [
    {
      label: "Churches",
      value: churches.length,
      icon: Church,
      href: "/admin/dashboard/churches",
      hint: "Churches & holy sites",
    },
    {
      label: "News Articles",
      value: news.length,
      icon: Newspaper,
      href: "/admin/dashboard/news",
      hint: `${published} published · ${drafts} drafts`,
    },
    {
      label: "Photos",
      value: photos.length,
      icon: Camera,
      href: "/admin/dashboard/gallery",
      hint: "Across all albums",
    },
    {
      label: "Videos",
      value: videos.length,
      icon: Video,
      href: "/admin/dashboard/videos",
      hint: "Liturgy, events & more",
    },
  ]

  const recentNews = news.slice(0, 4)

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground text-balance">
            Welcome back
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your parish news, photos, and videos from one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/gallery">
              <Camera className="h-4 w-4" />
              Add Photo
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/news">
              <Plus className="h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {stat.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {stat.hint}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent News */}
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-serif">Recent Articles</CardTitle>
              <CardDescription>Latest news content</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard/news">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentNews.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} · {item.date}
                  </p>
                </div>
                <Badge
                  variant={item.status === "published" ? "default" : "secondary"}
                  className="shrink-0 gap-1"
                >
                  {item.status === "published" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <PencilLine className="h-3 w-3" />
                  )}
                  {item.status}
                </Badge>
              </div>
            ))}
            {recentNews.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No articles yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Jump straight to a task</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/dashboard/mass-times">
                <Clock className="h-4 w-4" />
                Manage Mass Times
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/dashboard/news">
                <Newspaper className="h-4 w-4" />
                Manage News
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/dashboard/gallery">
                <Camera className="h-4 w-4" />
                Manage Gallery
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/dashboard/videos">
                <Video className="h-4 w-4" />
                Manage Videos
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/" target="_blank">
                <ArrowRight className="h-4 w-4" />
                Preview Website
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
