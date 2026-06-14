"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Newspaper,
  Upload,
  Star,
  CheckCircle2,
  FileText,
  Calendar,
  User,
  ImageIcon,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  useAdminData,
  newsCategories,
  type NewsItem,
  type Status,
} from "@/components/admin/admin-data"
import { DashboardHero } from "@/components/admin/dashboard-hero"

type FormState = Omit<NewsItem, "id">

const emptyForm: FormState = {
  title: "",
  titleAr: "",
  excerpt: "",
  content: "",
  author: "",
  category: newsCategories[0],
  date: new Date().toISOString().slice(0, 10),
  image: "",
  featured: false,
  status: "draft",
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function NewsAdminPage() {
  const { news, addNews, updateNews, deleteNews } = useAdminData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = news.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || n.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const publishedCount = news.filter((n) => n.status === "published").length
  const draftCount = news.filter((n) => n.status === "draft").length
  const featuredCount = news.filter((n) => n.featured).length

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(item: NewsItem) {
    setEditingId(item.id)
    const { id, ...rest } = item
    setForm({ ...emptyForm, ...rest })
    setDialogOpen(true)
  }

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }))
      toast.success("Image uploaded")
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!form.excerpt.trim()) {
      toast.error("Excerpt is required")
      return
    }
    const payload: FormState = {
      ...form,
      image: form.image || "/images/ehden-landscape.jpg",
    }
    if (editingId) {
      updateNews(editingId, payload)
      toast.success("Article updated")
    } else {
      addNews(payload)
      toast.success("Article created")
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (deleteId) {
      deleteNews(deleteId)
      toast.success("Article deleted")
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <DashboardHero
        badge="Parish Newsroom"
        title="News & Articles"
        titleAr="الأخبار والمقالات"
        description="Create, publish, and manage parish news, announcements, and stories shown on the website."
        icon={Newspaper}
        action={
          <Button
            onClick={openCreate}
            size="lg"
            className="bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: FileText, value: news.length, label: "Total articles" },
          {
            icon: CheckCircle2,
            value: publishedCount,
            label: "Published",
          },
          { icon: Pencil, value: draftCount, label: "Drafts" },
          { icon: Star, value: featuredCount, label: "Featured" },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "published", "draft"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col overflow-hidden border-none p-0 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {item.category}
                  </Badge>
                  {item.featured ? (
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  ) : null}
                </div>
                <Badge
                  variant={item.status === "published" ? "default" : "secondary"}
                  className="absolute right-3 top-3 capitalize"
                >
                  {item.status}
                </Badge>
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.date)}
                  </span>
                  {item.author ? (
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {item.author}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 font-serif text-lg font-semibold leading-tight text-foreground">
                  {item.title}
                </h3>
                {item.titleAr ? (
                  <p
                    className="mt-1 text-sm text-muted-foreground"
                    dir="rtl"
                  >
                    {item.titleAr}
                  </p>
                ) : null}
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {item.excerpt}
                </p>
                <div className="mt-auto flex justify-end gap-1 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(item)}
                    aria-label="Edit article"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                    aria-label="Delete article"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <Newspaper className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No articles found.</p>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingId ? "Edit Article" : "New Article"}
            </DialogTitle>
            <DialogDescription>
              Add the article details, upload a cover image, and write the full
              story.
            </DialogDescription>
          </DialogHeader>

          {/* Image uploader */}
          <div className="flex flex-col gap-2">
            <Label>Cover Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageFile(file)
                e.target.value = ""
              }}
            />
            {form.image ? (
              <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image || "/placeholder.svg"}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setForm({ ...form, image: "" })}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary hover:bg-muted"
              >
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">
                  Click to upload an image
                </span>
                <span className="text-xs">PNG or JPG, up to 5MB</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">
                or paste a URL
              </span>
              <Separator className="flex-1" />
            </div>
            <Input
              value={
                form.image.startsWith("data:") ? "" : form.image
              }
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/images/... or https://..."
            />
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Article title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="titleAr">Title (Arabic)</Label>
                <Input
                  id="titleAr"
                  dir="rtl"
                  value={form.titleAr}
                  onChange={(e) =>
                    setForm({ ...form, titleAr: e.target.value })
                  }
                  placeholder="العنوان بالعربية"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  placeholder="Short summary shown on cards..."
                  rows={2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {newsCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    placeholder="e.g. Parish Office"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as Status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex flex-col">
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured article
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Highlight this article at the top of the news page.
                  </span>
                </div>
                <Switch
                  id="featured"
                  checked={!!form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="flex flex-col gap-2 pt-4">
              <Label htmlFor="content">Full Article Body</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the full article here. Separate paragraphs with a blank line..."
                rows={12}
              />
              <p className="text-xs text-muted-foreground">
                This is the full story shown on the article detail page.
              </p>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Save Changes" : "Create Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
